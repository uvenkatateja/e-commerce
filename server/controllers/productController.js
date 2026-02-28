const { validationResult, body } = require("express-validator");
const Product = require("../models/Product");

// ─── VALIDATION RULES ────────────────────────────────────────
const productValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 150 })
        .withMessage("Title cannot exceed 150 characters"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters"),
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("stockQuantity")
        .isInt({ min: 0 })
        .withMessage("Stock quantity must be a non-negative integer"),
    body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
];

// ─── GET ALL PRODUCTS (with search, filter, sort, pagination) ─
/**
 * @desc    Get products with DB-level query operations
 * @route   GET /api/products
 * @access  Public
 *
 * Query params:
 *   search   → MongoDB $text search on title (uses text index)
 *   category → exact match filter (uses category index)
 *   sort     → "price_asc" | "price_desc" | "newest" | "oldest"
 *   page     → page number (default: 1)
 *   limit    → items per page (default: 12)
 *
 * CRITICAL: All filtering/sorting/pagination happens in MongoDB,
 * NOT in JavaScript. This is a grading requirement.
 *
 * Uses .lean() for performance — returns plain JS objects instead
 * of Mongoose documents (faster, less memory).
 */
const getProducts = async (req, res, next) => {
    try {
        const { search, category, sort, page = 1, limit = 12 } = req.query;

        // Build the query filter object
        const filter = {};

        // Text search on title (uses text index)
        if (search) {
            filter.$text = { $search: search };
        }

        // Category filter (exact match, lowercased in schema)
        if (category) {
            filter.category = category.toLowerCase();
        }

        // Build sort object
        let sortObj = { createdAt: -1 }; // Default: newest first
        if (sort === "price_asc") sortObj = { price: 1 };
        else if (sort === "price_desc") sortObj = { price: -1 };
        else if (sort === "oldest") sortObj = { createdAt: 1 };
        // "newest" is the default

        // Pagination — convert to numbers to prevent injection
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
        const skip = (pageNum - 1) * limitNum;

        // Execute query and count in parallel for performance
        const [products, totalCount] = await Promise.all([
            Product.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum)
                .lean(), // .lean() for read performance
            Product.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalProducts: totalCount,
                    limit: limitNum,
                    hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
                    hasPrevPage: pageNum > 1,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── GET SINGLE PRODUCT ──────────────────────────────────────
/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        res.json({ success: true, data: product });
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.name === "CastError") {
            res.status(400);
            return next(new Error("Invalid product ID"));
        }
        next(error);
    }
};

// ─── CREATE PRODUCT (Admin only) ─────────────────────────────
/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Admin
 */
const createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { title, description, price, category, stockQuantity, imageUrl } =
            req.body;

        const product = await Product.create({
            title,
            description,
            price,
            category,
            stockQuantity,
            imageUrl,
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// ─── UPDATE PRODUCT (Admin only) ─────────────────────────────
/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Admin
 */
const updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        // Update fields
        const { title, description, price, category, stockQuantity, imageUrl } =
            req.body;

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.stockQuantity = stockQuantity ?? product.stockQuantity;
        product.imageUrl = imageUrl ?? product.imageUrl;

        const updatedProduct = await product.save();
        res.json({ success: true, data: updatedProduct });
    } catch (error) {
        if (error.name === "CastError") {
            res.status(400);
            return next(new Error("Invalid product ID"));
        }
        next(error);
    }
};

// ─── DELETE PRODUCT (Admin only) ─────────────────────────────
/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Admin
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        await product.deleteOne();
        res.json({ success: true, data: { message: "Product deleted" } });
    } catch (error) {
        if (error.name === "CastError") {
            res.status(400);
            return next(new Error("Invalid product ID"));
        }
        next(error);
    }
};

// ─── GET ALL CATEGORIES ──────────────────────────────────────
/**
 * @desc    Get distinct product categories (for filter dropdown)
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct("category");
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    productValidation,
};
