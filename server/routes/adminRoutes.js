const express = require("express");
const router = express.Router();
const { getAdminStats, getAllOrders, getPriceHistory } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

/**
 * Admin Routes
 *
 * All routes require BOTH protect (JWT auth) AND admin (role check).
 * This ensures only authenticated admin users can access these endpoints.
 *
 * GET /api/admin/stats          → dashboard stats (revenue, counts, low stock)
 * GET /api/admin/orders         → all orders with user info (paginated)
 * GET /api/admin/price-history  → product price change history
 */

router.get("/stats", protect, admin, getAdminStats);
router.get("/orders", protect, admin, getAllOrders);
router.get("/price-history", protect, admin, getPriceHistory);

module.exports = router;
