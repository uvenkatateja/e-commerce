/**
 * Admin middleware: checks if the authenticated user has admin role.
 *
 * MUST be used AFTER authMiddleware (protect) — it depends on req.user
 * being already set by the auth middleware.
 *
 * Usage in routes: router.get("/stats", protect, admin, getStats)
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        next(new Error("Not authorized — admin access required"));
    }
};

module.exports = { admin };
