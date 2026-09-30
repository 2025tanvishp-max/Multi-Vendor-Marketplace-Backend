const express = require("express");

const {
    registerVendor,
    loginVendor
} = require("../controllers/authController");

const router = express.Router();

// Vendor registration
router.post("/register", registerVendor);

// Vendor login
router.post("/login", loginVendor);

module.exports = router;