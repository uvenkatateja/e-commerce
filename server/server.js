const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables FIRST — before any other code uses them
dotenv.config();

// Import route files (we'll create these in later steps)
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import middleware
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

// ─── SECURITY MIDDLEWARE ─────────────────────────────────────
// Helmet sets various HTTP headers to help protect the app
app.use(helmet());

// CORS — only allow requests from our frontend URL
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Required for httpOnly cookie auth
    })
);

// ─── STRIPE WEBHOOK ROUTE (must be BEFORE express.json()) ────
// Stripe needs the raw body to verify webhook signatures.
// If we parse JSON first, the signature verification will fail.
app.use(
    "/api/orders/webhook",
    express.raw({ type: "application/json" })
);

// ─── BODY PARSERS ────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── API ROUTES ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({ success: true, data: { status: "Server is running" } });
});

// ─── ERROR HANDLING ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── START SERVER ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(
            `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
        );
    });
};

startServer();

module.exports = app; // Export for testing if needed
