const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// ─── GET ADMIN DASHBOARD STATS ───────────────────────────────
/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Admin
 *
 * Returns:
 * - Total revenue (sum of all paid orders)
 * - Total orders count (all statuses)
 * - Total paid orders count
 * - Total products count
 * - Total users count
 * - Low stock products (stockQuantity <= 10)
 *
 * Uses MongoDB aggregation pipeline for revenue calculation
 * to keep computation on the DB side, not in JavaScript.
 */
const getAdminStats = async (req, res, next) => {
    try {
        // Run all queries in parallel for performance
        const [
            revenueResult,
            totalOrders,
            paidOrders,
            totalProducts,
            totalUsers,
            lowStockProducts,
        ] = await Promise.all([
            // Aggregate total revenue from paid orders
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
            ]),
            Order.countDocuments(),
            Order.countDocuments({ paymentStatus: "paid" }),
            Product.countDocuments(),
            User.countDocuments(),
            Product.find({ stockQuantity: { $lte: 10 } })
                .select("title stockQuantity category")
                .lean(),
        ]);

        const totalRevenue =
            revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                paidOrders,
                totalProducts,
                totalUsers,
                lowStockProducts,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── GET ALL ORDERS (Admin) ──────────────────────────────────
/**
 * @desc    Get all orders with user info (for admin management)
 * @route   GET /api/admin/orders
 * @access  Admin
 *
 * Populates userId with user's name and email.
 * Sorted by newest first.
 * Uses .lean() for read performance.
 */
const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;

        const [orders, totalCount] = await Promise.all([
            Order.find()
                .populate("userId", "name email") // Include user name and email
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Order.countDocuments(),
        ]);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalOrders: totalCount,
                    limit: limitNum,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminStats,
    getAllOrders,
};
