const express = require("express");
const router = express.Router();
const {
    createCheckoutSession,
    getMyOrders,
} = require("../controllers/orderController");
const { handleWebhook } = require("../utils/stripeWebhook");
const { protect } = require("../middleware/authMiddleware");

/**
 * Order Routes
 *
 * IMPORTANT: The webhook route does NOT use auth middleware.
 * Stripe calls it directly — authentication is done via
 * webhook signature verification instead.
 *
 * The webhook route also needs express.raw() body parser,
 * which is configured in server.js BEFORE express.json().
 *
 * POST /api/orders/webhook      → Stripe webhook (no auth, raw body)
 * POST /api/orders/checkout     → Create checkout session (protected)
 * GET  /api/orders/my-orders    → User's order history (protected)
 */

// Stripe webhook — NO auth middleware, uses raw body
router.post("/webhook", handleWebhook);

// Protected user routes
router.post("/checkout", protect, createCheckoutSession);
router.get("/my-orders", protect, getMyOrders);

module.exports = router;
