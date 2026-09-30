const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

// ================================
// REGISTER VENDOR
// ================================
const registerVendor = async (req, res) => {
    try {
        const { name, email, password, storeName } = req.body;

        // Check required fields
        if (!name || !email || !password || !storeName) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if vendor already exists
        const existingVendor = await Vendor.findOne({ email });

        if (existingVendor) {
            return res.status(400).json({
                message: "Vendor already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create vendor
        const vendor = await Vendor.create({
            name,
            email,
            password: hashedPassword,
            storeName
        });

        res.status(201).json({
            message: "Vendor registered successfully",
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                storeName: vendor.storeName
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// ================================
// LOGIN VENDOR
// ================================
const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find vendor
        const vendor = await Vendor.findOne({ email });

        if (!vendor) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            vendor.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: vendor._id,
                email: vendor.email,
                role: "vendor"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


module.exports = {
    registerVendor,
    loginVendor
};