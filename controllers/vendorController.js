const OrderItem = require("../models/OrderItem");

// ========================================
// GET VENDOR'S ORDER ITEMS
// ========================================
const getVendorOrderItems = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Check if logged-in vendor owns this vendor ID
        if (req.user.id.toString() !== vendorId.toString()) {
            return res.status(403).json({
                message: "Access denied. You can only view your own orders."
            });
        }

        const orderItems = await OrderItem.find({
            vendor: vendorId
        })
            .populate("product")
            .populate("order")
            .populate("vendor", "name email storeName");

        res.json({
            count: orderItems.length,
            orderItems
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vendor order items",
            error: error.message
        });
    }
};


// ========================================
// UPDATE VENDOR ORDER ITEM STATUS
// ========================================
const updateOrderItemStatus = async (req, res) => {
    try {
        const { orderItemId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                allowedStatuses
            });
        }

        // Find order item
        const orderItem = await OrderItem.findById(orderItemId);

        if (!orderItem) {
            return res.status(404).json({
                message: "Order item not found"
            });
        }

        // Ownership check
        if (orderItem.vendor.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "Access denied. You can only update your own order items."
            });
        }

        // Update status
        orderItem.status = status;

        await orderItem.save();

        const updatedItem = await OrderItem.findById(orderItemId)
            .populate("product")
            .populate("vendor", "name email storeName");

        res.json({
            message: "Order item status updated successfully",
            orderItem: updatedItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update order item",
            error: error.message
        });
    }
};


module.exports = {
    getVendorOrderItems,
    updateOrderItemStatus
};