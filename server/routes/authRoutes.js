const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getMe,
    logout,
    registerValidation,
    loginValidation,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

/**
 * Auth Routes
 *
 * Rate limiter is applied to register and login to prevent brute-force attacks.
 * The protect middleware is used on /me and /logout to verify the JWT cookie.
 *
 * POST /api/auth/register  → validate input → create user → set cookie
 * POST /api/auth/login     → validate input → verify creds → set cookie
 * GET  /api/auth/me         → verify cookie → return user
 * POST /api/auth/logout     → clear cookie
 */

// Public routes (with rate limiting)
router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
