const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Stripe Webhook Handler
 *
 * This function processes Stripe webhook events.
 * It is called by Stripe's servers after payment events occur.
 *
 * CRITICAL SECURITY: The webhook signature is verified using
 * stripe.webhooks.constructEvent() to ensure the request
 * actually came from Stripe and wasn't forged.
 *
 * The raw body is required for signature verification —
 * that's why server.js mounts express.raw() on this route
 * BEFORE express.json().
 *
 * Events handled:
 * - checkout.session.completed → mark order paid + deduct stock
 * - checkout.session.expired   → mark order failed
 */
const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    // Step 1: Verify webhook signature
    try {
        event = stripe.webhooks.constructEvent(
            req.body, // raw body (Buffer) — NOT parsed JSON
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: `Webhook Error: ${err.message}`,
        });
    }

    // Step 2: Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const orderId = session.metadata.orderId;

                if (!orderId) {
                    console.error("No orderId in session metadata");
                    break;
                }

                // Find the order
                const order = await Order.findById(orderId);
                if (!order) {
                    console.error(`Order not found: ${orderId}`);
                    break;
                }

                // Prevent duplicate processing
                if (order.paymentStatus === "paid") {
                    console.log(`Order ${orderId} already processed`);
                    break;
                }

                // Mark order as paid
                order.paymentStatus = "paid";
                await order.save();

                // Deduct stock for each item
                // Uses $inc with negative values for atomic decrement
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.productId, {
                        $inc: { stockQuantity: -item.quantity },
                    });
                }

                console.log(`✅ Order ${orderId} paid. Stock deducted.`);
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object;
                const orderId = session.metadata.orderId;

                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, {
                        paymentStatus: "failed",
                    });
                    console.log(`❌ Order ${orderId} expired/failed.`);
                }
                break;
            }

            default:
                // Unhandled event type — log but don't error
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error(`Webhook processing error: ${error.message}`);
        // Still return 200 — Stripe will keep retrying on non-200 responses
        // which could cause duplicate processing
    }

    // Always return 200 to acknowledge receipt
    // Stripe retries on non-200, which we want to avoid
    res.json({ received: true });
};

module.exports = { handleWebhook };
