/**
 * Global error handling middleware.
 *
 * Express identifies error-handling middleware by its 4 arguments (err, req, res, next).
 * This catches all errors thrown/passed via next(error) in controllers.
 *
 * Follows the { success: false, message: "..." } response format.
 */

// Handle 404 — route not found
const notFound = (req, res, next) => {
    const error = new Error(`Not found — ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    // If status is still 200 (default), set it to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Include stack trace only in development for debugging
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = { notFound, errorHandler };
