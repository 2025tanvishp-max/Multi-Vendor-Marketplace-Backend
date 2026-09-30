const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: String,
            required: true
        },

        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "OrderItem"
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        shippingAddress: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);