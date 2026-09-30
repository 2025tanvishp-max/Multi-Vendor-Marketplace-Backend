const express = require("express");

const {
    createOrder,
    getAllOrders,
    getOrderById,
    getVendorOrderItems,
    updateOrderItemStatus
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const vendorMiddleware = require("../middleware/vendorMiddleware");

const router = express.Router();


// =====================================================
// CUSTOMER ORDER ROUTES
// =====================================================

// Create order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get single order
router.get("/:id", getOrderById);


// =====================================================
// VENDOR ROUTES
// =====================================================

// Vendor sees their own order items
router.get(
    "/vendor/:id/items",
    authMiddleware,
    vendorMiddleware,
    getVendorOrderItems
);

// Vendor updates order item status
router.put(
    "/items/:id/status",
    authMiddleware,
    vendorMiddleware,
    updateOrderItemStatus
);


module.exports = router;