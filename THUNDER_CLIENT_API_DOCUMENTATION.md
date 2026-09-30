# Multi-Vendor Marketplace Order Management
## Thunder Client API Documentation

**Case Study:** 188  
**Technology:** Node.js, Express.js, MongoDB, Mongoose, JWT  
**Base URL:** `http://localhost:5001`

> Thunder Client note: the current Free plan does not support Collections. The API requests can still be tested individually in Thunder Client Activity. This document records the API testing workflow and submission evidence.

## 1. Project Overview

The backend supports multiple independent vendors. A customer can place one order containing products from different vendors. At checkout, the backend creates separate `OrderItem` records for the correct vendors, while the customer can retrieve the complete order.

Case-study requirements:
- Vendor, Product, Order and OrderItem Mongoose schemas
- CRUD operations for vendor product listings
- Order splitting by vendor
- Ownership-based vendor authorization
- Order validation
- JWT authentication
- MongoDB Atlas configuration

## 2. Authentication

### Register Vendor

**POST**
```text
http://localhost:5001/api/auth/register
```

Body:
```json
{
  "name": "Tanvish",
  "email": "tanvish@test.com",
  "password": "123456",
  "storeName": "Tanvish Tech Store"
}
```

### Login Vendor

**POST**
```text
http://localhost:5001/api/auth/login
```

Body:
```json
{
  "email": "tanvish@test.com",
  "password": "123456"
}
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}
```

For protected requests:
```text
Authorization: Bearer JWT_TOKEN
```

## 3. Products

### Get All Products

**GET**
```text
http://localhost:5001/api/products
```

### Create Product

**POST**
```text
http://localhost:5001/api/products
```

Body:
```json
{
  "name": "Gaming Mouse",
  "description": "RGB wireless gaming mouse",
  "price": 1299,
  "stock": 20,
  "category": "Gaming Accessories",
  "vendor": "VENDOR_ID"
}
```

### Get Product By ID

**GET**
```text
http://localhost:5001/api/products/PRODUCT_ID
```

### Update Product

**PUT**
```text
http://localhost:5001/api/products/PRODUCT_ID
```

Example body:
```json
{
  "price": 1399,
  "stock": 25
}
```

### Delete Product

**DELETE**
```text
http://localhost:5001/api/products/PRODUCT_ID
```

## 4. Orders

### Create Order / Checkout

**POST**
```text
http://localhost:5001/api/orders
```

Body:
```json
{
  "customer": "Tanvish",
  "shippingAddress": "Navi Mumbai",
  "items": [
    {
      "product": "PRODUCT_ID_1",
      "quantity": 2
    },
    {
      "product": "PRODUCT_ID_2",
      "quantity": 1
    }
  ]
}
```

The backend:
1. Validates the order.
2. Finds each product and its vendor.
3. Creates the Order.
4. Creates separate OrderItems.
5. Associates each OrderItem with its product and vendor.
6. Calculates the total.
7. Reduces stock.
8. Stores OrderItem references in the Order.

### Get Complete Order

**GET**
```text
http://localhost:5001/api/orders/ORDER_ID
```

This returns the customer's complete order, including items belonging to different vendors.

## 5. Vendor Order Management

### Get Vendor Order Items

**GET**
```text
http://localhost:5001/api/vendors/VENDOR_ID/order-items
```

Header:
```text
Authorization: Bearer JWT_TOKEN
```

A vendor can access only its own OrderItems.

### Update Vendor Order Item Status

**PUT**
```text
http://localhost:5001/api/vendors/order-items/ORDER_ITEM_ID
```

Header:
```text
Authorization: Bearer JWT_TOKEN
```

Body:
```json
{
  "status": "Processing"
}
```

Valid statuses:
```text
Pending
Processing
Shipped
Delivered
Cancelled
```

## 6. Ownership Authorization Test

Use Vendor A's JWT to attempt to update an OrderItem owned by Vendor B.

Expected result:

```text
403 Forbidden
```

Expected response:
```json
{
  "message": "Access denied. You can only update your own order items"
}
```

This demonstrates ownership-based authorization.

## 7. Tested Multi-Vendor Scenario

Vendor 1:
```text
Tanvish
Tanvish Tech Store
Gaming Mouse
₹1299
```

Vendor 2:
```text
Rahul
Rahul Electronics
Mechanical Keyboard
₹2499
```

Customer order:
```text
Gaming Mouse × 2 = ₹2598
Mechanical Keyboard × 1 = ₹2499
Total = ₹5097
```

Result:
```text
Order
 ├── OrderItem → Gaming Mouse → Tanvish
 └── OrderItem → Mechanical Keyboard → Rahul
```

The customer sees the complete order, while each vendor is restricted to its own OrderItems.

## 8. Thunder Client Testing Checklist

- [x] Register Vendor
- [x] Login Vendor
- [x] Get All Products
- [x] Create Product
- [x] Get Product By ID
- [x] Update Product
- [x] Delete Product
- [x] Create Multi-Vendor Order
- [x] Get Complete Order
- [x] Get Vendor Order Items
- [x] Update Vendor Order Item
- [x] Unauthorized Vendor Update → 403

Take screenshots of successful requests/responses from Thunder Client Activity as submission evidence.

## 9. Backend Structure

```text
BackEnd-final/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── customerOrderController.js
├── middleware/
│   ├── authMiddleware.js
│   └── vendorMiddleware.js
├── models/
│   ├── Vendor.js
│   ├── Product.js
│   ├── Order.js
│   └── OrderItem.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── customerOrderRoutes.js
│   └── vendorRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 10. Environment Configuration

```env
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
PORT=5001
JWT_SECRET=YOUR_JWT_SECRET
```

Do not commit the real `.env` file to GitHub.

## 11. Server

Start:
```bash
npm run dev
```

or:
```bash
node server.js
```

Server:
```text
http://localhost:5001
```

Root test:

**GET**
```text
http://localhost:5001/
```

Expected:
```json
{
  "message": "Multi-Vendor Marketplace API is running"
}
```

## 12. Case Study Requirement Checklist

| Requirement | Implementation |
|---|---|
| Vendor schema | `models/Vendor.js` |
| Product schema | `models/Product.js` |
| Order schema | `models/Order.js` |
| OrderItem schema | `models/OrderItem.js` |
| Vendor product CRUD | Product API |
| Order splitting | `POST /api/orders` |
| Vendor ownership | Vendor authorization middleware |
| JWT authentication | `authMiddleware.js` |
| Order validation | Controller + Mongoose validation |
| MongoDB Atlas | `config/db.js` + `.env` |
| Vendor order management | Vendor order routes |
| Customer complete order | Customer order endpoint |
| Thunder Client testing | Individual requests tested in Activity |

## Submission Note

Thunder Client's current Free version does not provide Collections. Therefore, the requests are tested individually through Thunder Client Activity, and this document records the complete API test plan and results.

Thunder Client's official documentation states that collection import/export is a paid feature.
