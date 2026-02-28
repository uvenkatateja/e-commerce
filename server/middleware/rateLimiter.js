const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for auth routes.
 * Prevents brute-force attacks on login/register endpoints.
 *
 * Config: 20 requests per 15 minutes per IP.
 * Uses the standardized response format.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { authLimiter };
