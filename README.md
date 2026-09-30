# Multi-Vendor Marketplace Order Management

## Case Study 188

A backend REST API for managing a multi-vendor marketplace where customers can place orders containing products from different vendors.

The system automatically separates order items by vendor and ensures that each vendor can only manage their own order items.

---

## Features

- Vendor registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Vendor product management
- Product CRUD operations
- Multi-vendor order creation
- Automatic order splitting by vendor
- Vendor-specific order item access
- Ownership-based authorization
- Order status management
- Product stock management
- MongoDB Atlas database
- Mongoose referenced collections
- Thunder Client API testing

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- CORS
- Thunder Client

---

## Project Structure

```text
BACKEND-FINAL/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── customerOrderController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── vendorMiddleware.js
│
├── models/
│   ├── Vendor.js
│   ├── Product.js
│   ├── Order.js
│   └── OrderItem.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── customerOrderRoutes.js
│   └── vendorRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── THUNDER_CLIENT_API_DOCUMENTATION.md