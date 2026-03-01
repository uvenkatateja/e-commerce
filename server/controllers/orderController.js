const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");

// ─── CREATE CHECKOUT SESSION ─────────────────────────────────
/**
 * @desc    Create a Stripe Checkout Session and pending Order
 * @route   POST /api/orders/checkout
 * @access  Protected (user must be logged in)
 *
 * Request body: { items: [{ productId, quantity }] }
 *
 * Flow:
 * 1. Validate all products exist and have enough stock
 * 2. Create Order with status "pending" (NO stock deduction here)
 * 3. Create Stripe Checkout Session with line_items
 * 4. Save stripeSessionId on the Order
 * 5. Return the Stripe session URL for frontend redirect
 *
 * CRITICAL: Stock is NOT deducted here. It only happens in the
 * webhook after Stripe confirms payment. This prevents stock
 * issues if the user abandons checkout.
 */
const createCheckoutSession = async (req, res, next) => {
    try {
        const { items } = req.body;

        // Validate items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400);
            throw new Error("Please provide items to checkout");
        }

        // Validate each item and build order items + Stripe line items
        const orderItems = [];
        const lineItems = [];

        for (const item of items) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity < 1) {
                res.status(400);
                throw new Error("Each item must have a valid productId and quantity >= 1");
            }

            // Find product
            const product = await Product.findById(productId);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${productId}`);
            }

            // Check stock availability
            if (product.stockQuantity < quantity) {
                res.status(400);
                throw new Error(
                    `Insufficient stock for "${product.title}". Available: ${product.stockQuantity}, Requested: ${quantity}`
                );
            }

            // Build order item (snapshot of product data at purchase time)
            orderItems.push({
                productId: product._id,
                title: product.title,
                quantity: parseInt(quantity, 10),
                priceAtPurchase: product.price,
            });

            // Build Stripe line item
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.title,
                        description: product.description.substring(0, 200),
                    },
                    unit_amount: Math.round(product.price * 100), // Stripe uses cents
                },
                quantity: parseInt(quantity, 10),
            });
        }

        // Calculate total
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.priceAtPurchase * item.quantity,
            0
        );

        // Create Order with pending status (NO stock deduction yet)
        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            totalAmount,
            stripeSessionId: "pending", // Will be updated after session creation
            paymentStatus: "pending",
        });

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            metadata: {
                orderId: order._id.toString(), // Used by webhook to find our Order
            },
            customer_email: req.user.email, // Pre-fill email on Stripe page
        });

        // Update order with the real Stripe session ID
        order.stripeSessionId = session.id;
        await order.save();

        res.json({
            success: true,
            data: { url: session.url },
        });
    } catch (error) {
        next(error);
    }
};

// ─── GET USER'S ORDER HISTORY ────────────────────────────────
/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Protected
 *
 * Returns orders sorted by newest first.
 * Uses .lean() for read performance.
 */
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate("items.productId", "imageUrl category")
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCheckoutSession,
    getMyOrders,
};
