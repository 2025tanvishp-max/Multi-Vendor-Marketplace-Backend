const Order = require("../models/Order");

// ========================================
// GET COMPLETE ORDER BY ID
// ========================================
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate({
                path: "items",
                populate: [
                    {
                        path: "product"
                    },
                    {
                        path: "vendor",
                        select: "name email storeName"
                    }
                ]
            });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order fetched successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
};

module.exports = {
    getOrderById
};