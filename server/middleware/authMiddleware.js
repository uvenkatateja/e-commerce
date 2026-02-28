const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Auth middleware: verifies JWT from httpOnly cookie.
 *
 * Flow:
 * 1. Extract token from cookie (req.cookies.token)
 * 2. Verify token with JWT_SECRET
 * 3. Find user in DB (exclude password)
 * 4. Attach user to req.user for downstream route handlers
 *
 * If token is missing or invalid, return 401 Unauthorized.
 */
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401);
            throw new Error("Not authorized — no token provided");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (exclude password)
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("Not authorized — user not found");
        }

        next();
    } catch (error) {
        // If jwt.verify throws (expired/malformed), catch it here
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            res.status(401);
            return next(new Error("Not authorized — invalid or expired token"));
        }
        next(error);
    }
};

module.exports = { protect };
