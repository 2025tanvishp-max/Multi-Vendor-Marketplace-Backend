const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const vendorMiddleware = require("../middleware/vendorMiddleware");

const router = express.Router();


// ==========================================
// PRODUCT ROUTES
// ==========================================

// Create product
router.post(
    "/",
    authMiddleware,
    vendorMiddleware,
    createProduct
);

// Get all products
router.get(
    "/",
    getAllProducts
);

// Get single product
router.get(
    "/:id",
    getProductById
);

// Update product
router.put(
    "/:id",
    authMiddleware,
    vendorMiddleware,
    updateProduct
);

// Delete product
router.delete(
    "/:id",
    authMiddleware,
    vendorMiddleware,
    deleteProduct
);


module.exports = router;