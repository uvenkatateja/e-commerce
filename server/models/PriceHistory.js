const mongoose = require("mongoose");

/**
 * PriceHistory — Tracks every product price change.
 * Created any time an admin updates a product's price.
 * Displayed in the admin panel's "Price History" section.
 */
const priceHistorySchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productTitle: {
            type: String,
            required: true,
        },
        oldPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        newPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        currency: {
            type: String,
            default: "USD",
        },
    },
    {
        timestamps: true, // createdAt = when the price changed
    }
);

// Index for fast lookups: newest changes first, and by product
priceHistorySchema.index({ createdAt: -1 });
priceHistorySchema.index({ productId: 1, createdAt: -1 });

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
