const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            lowercase: true, // Normalize for consistent filtering
        },
        stockQuantity: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        imageUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true, // createdAt + updatedAt
    }
);

/**
 * TEXT INDEX on title — enables $text search queries for the search feature.
 * MongoDB text indexes support word stemming, stop words, and relevance scoring.
 *
 * REGULAR INDEX on category — speeds up filter-by-category queries.
 *
 * These two indexes directly support the DB-level filtering/search requirement.
 */
productSchema.index({ title: "text" });
productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
