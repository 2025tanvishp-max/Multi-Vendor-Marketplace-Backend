const mongoose = require("mongoose");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

// =====================================================
// CREATE ORDER
// =====================================================
const createOrder = async (req, res) => {
    try {
        const {
            customer,
            shippingAddress,
            items
        } = req.body;

        // Validate request
        if (!customer || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({
                message: "Customer, shipping address and items are required"
            });
        }

        // Validate all product IDs
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({
                    message: `Invalid product ID: ${item.product}`
                });
            }
        }

        // Get products from database
        const productIds = items.map(item => item.product);

        const products = await Product.find({
            _id: { $in: productIds }
        });

        // Check every product exists
        for (const item of items) {
            const product = products.find(
                p => p._id.toString() === item.product.toString()
            );

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`
                });
            }

            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }
        }

        // Calculate total
        let totalAmount = 0;

        for (const item of items) {
            const product = products.find(
                p => p._id.toString() === item.product.toString()
            );

            totalAmount += product.price * item.quantity;
        }

        // Create main order first
        const order = await Order.create({
            customer,
            shippingAddress,
            totalAmount,
            items: []
        });

        // Create OrderItems
        const orderItems = [];

        for (const item of items) {
            const product = products.find(
                p => p._id.toString() === item.product.toString()
            );

            const orderItem = await OrderItem.create({
                order: order._id,
                product: product._id,
                vendor: product.vendor,
                quantity: item.quantity,
                price: product.price,
                status: "Pending"
            });

            orderItems.push(orderItem._id);

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Attach OrderItems to main order
        order.items = orderItems;
        await order.save();

        // Return populated order
        const populatedOrder = await Order.findById(order._id)
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

        res.status(201).json({
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        console.error("ORDER ERROR:", error);

        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL ORDERS
// =====================================================
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
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
            })
            .sort({ createdAt: -1 });

        res.json({
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// =====================================================
// GET SINGLE ORDER
// =====================================================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
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

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// =====================================================
// GET VENDOR ORDER ITEMS
// =====================================================
const getVendorOrderItems = async (req, res) => {
    try {
        const vendorId = req.params.id;

        const orderItems = await OrderItem.find({
            vendor: vendorId
        })
            .populate("product")
            .populate("order");

        res.json({
            vendor: vendorId,
            count: orderItems.length,
            orderItems
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vendor orders",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE ORDER ITEM STATUS
// =====================================================
const updateOrderItemStatus = async (req, res) => {
    try {
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
                message: "Invalid status"
            });
        }

        const orderItem = await OrderItem.findById(req.params.id);

        if (!orderItem) {
            return res.status(404).json({
                message: "Order item not found"
            });
        }

        // Vendor can only update their own item
        if (
            req.user &&
            orderItem.vendor.toString() !== req.user.id.toString()
        ) {
            return res.status(403).json({
                message: "You can only update your own order items"
            });
        }

        orderItem.status = status;

        await orderItem.save();

        res.json({
            message: "Order item status updated successfully",
            orderItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update order item",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getVendorOrderItems,
    updateOrderItemStatus
};