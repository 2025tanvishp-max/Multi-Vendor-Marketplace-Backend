const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const customerOrderRoutes = require("./routes/customerOrderRoutes");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/orders", customerOrderRoutes);

app.use("/api/vendors", vendorRoutes);


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Multi-Vendor Marketplace API is running"
    });
});


// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error(
            "Server failed to start:",
            error.message
        );
    }
};

startServer();