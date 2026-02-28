const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const User = require("../models/User");

// ─── HELPER: Generate JWT and set httpOnly cookie ────────────
/**
 * Creates a signed JWT with the user's ID, then sets it as an
 * httpOnly cookie on the response.
 *
 * Cookie config:
 * - httpOnly: true    → JS can't read it (XSS protection)
 * - secure: true      → only sent over HTTPS (in production)
 * - sameSite: "lax"   → prevents CSRF for cross-origin requests
 * - maxAge: 7 days    → matches JWT_EXPIRE
 */
const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return token;
};

// ─── VALIDATION RULES ────────────────────────────────────────
// Exported so routes can use them as middleware before the controller
const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 50 })
        .withMessage("Name cannot exceed 50 characters"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

// ─── CONTROLLERS ─────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Flow:
 * 1. Validate request body (express-validator)
 * 2. Check if email already exists
 * 3. Create user (password auto-hashed by pre-save hook)
 * 4. Generate JWT → set httpOnly cookie
 * 5. Return user data (no password)
 */
const register = async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            res.status(400);
            throw new Error("User with this email already exists");
        }

        // Create user — password is hashed automatically by the pre-save hook
        const user = await User.create({ name, email, password });

        // Generate token and set cookie
        generateTokenAndSetCookie(res, user._id);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 *
 * Flow:
 * 1. Validate request body
 * 2. Find user by email (include password field with +password)
 * 3. Compare passwords using the matchPassword instance method
 * 4. Generate JWT → set httpOnly cookie
 * 5. Return user data (no password)
 */
const login = async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { email, password } = req.body;

        // Find user and explicitly include password (select: false in schema)
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(res, user._id);

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Protected
 *
 * req.user is already set by the protect middleware.
 * We just return it.
 */
const getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user (clear the httpOnly cookie)
 * @route   POST /api/auth/logout
 * @access  Protected
 */
const logout = async (req, res, next) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0), // Expire immediately
        });

        res.json({
            success: true,
            data: { message: "Logged out successfully" },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    registerValidation,
    loginValidation,
};
