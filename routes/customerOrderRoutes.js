const express = require("express");

const {
    getOrderById
} = require("../controllers/customerOrderController");

const router = express.Router();

// ========================================
// GET COMPLETE CUSTOMER ORDER
// ========================================
router.get("/:orderId", getOrderById);

module.exports = router;