const express = require("express");

const {
    getVendorOrderItems,
    updateOrderItemStatus
} = require("../controllers/vendorController");

const authMiddleware = require("../middleware/authMiddleware");
const vendorMiddleware = require("../middleware/vendorMiddleware");

const router = express.Router();


// ========================================
// GET VENDOR'S ORDER ITEMS
// ========================================
router.get(
    "/:vendorId/order-items",
    authMiddleware,
    vendorMiddleware,
    getVendorOrderItems
);


// ========================================
// UPDATE ORDER ITEM STATUS
// ========================================
router.put(
    "/order-items/:orderItemId/status",
    authMiddleware,
    vendorMiddleware,
    updateOrderItemStatus
);


module.exports = router;