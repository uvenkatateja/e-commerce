const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    productValidation,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

/**
 * Product Routes
 *
 * Public:
 *   GET /api/products             → list with search/filter/sort/pagination
 *   GET /api/products/categories  → distinct categories for dropdown
 *   GET /api/products/:id         → single product detail
 *
 * Admin only (protect + admin middleware stacked):
 *   POST   /api/products          → create new product
 *   PUT    /api/products/:id      → update product
 *   DELETE /api/products/:id      → delete product
 *
 * NOTE: /categories must be defined BEFORE /:id,
 * otherwise Express treats "categories" as an :id param.
 */

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories); // Must be before /:id
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, admin, productValidation, createProduct);
router.put("/:id", protect, admin, productValidation, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
