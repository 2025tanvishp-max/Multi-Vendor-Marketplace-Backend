const Product = require("../models/Product");

// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        // Check required fields
        if (!name || !description || price === undefined || stock === undefined || !category) {
            return res.status(400).json({
                message: "All product fields are required"
            });
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            vendor: req.user.id
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("vendor", "name email storeName");

        res.json({
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("vendor", "name email storeName");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Ownership check
        if (product.vendor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own products"
            });
        }

        const { name, description, price, stock, category } = req.body;

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;

        await product.save();

        res.json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Ownership check
        if (product.vendor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own products"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};