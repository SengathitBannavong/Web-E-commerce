# API Documentation - E-Commerce Backend

## Base URL
All endpoints are prefixed with the base URL of your server.

---

## Table of Contents
1. [User Routes](#1-user-routes)
2. [Category Routes](#2-category-routes)
3. [Product Routes](#3-product-routes)
4. [Cart Routes](#4-cart-routes)
5. [Order Routes](#5-order-routes)
6. [Payment Routes](#6-payment-routes)
7. [Stock Routes](#7-stock-routes)
8. [Stripe/Payment Gateway Routes](#8-stripepayment-gateway-routes)
9. [Dashboard Routes](#9-dashboard-routes)

---

## 1. USER ROUTES
**Base Path**: `/api/users`

### Public Routes

#### Register User
```
POST /api/users/register
```
**Authentication**: None (Public)

**Request Body**:
```json
{
  "Name": "string",           // Required, max 64 chars
  "Email": "string",          // Required, must be valid email format
  "Password": "string",       // Required
  "Address": "string",        // Required, max 256 chars
  "PhoneNumber": "string",    // Required, max 256 chars
  "Gender": "string"          // Required, max 32 chars
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "User_Id": "U0000001",
    "Name": "string",
    "Email": "string",
    "Address": "string",
    "PhoneNumber": "string",
    "Gender": "string"
  },
  "token": "jwt_token_string"
}
```

---

#### Login User
```
POST /api/users/login
```
**Authentication**: None (Public)

**Request Body**:
```json
{
  "Email": "string",          // Required
  "Password": "string"        // Required
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "User_Id": "U0000001",
    "Name": "string",
    "Email": "string",
    "Role": "user" or "admin"
  },
  "token": "jwt_token_string"
}
```

---

### User Protected Routes

#### Get Current User
```
GET /api/users/me
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "User_Id": "U0000001",
  "Name": "string",
  "Email": "string",
  "Address": "string",
  "PhoneNumber": "string",
  "Gender": "string",
  "Role": "user"
}
```

---

#### Update Current User Profile
```
PUT /api/users/me
```
**Authentication**: Required (User)

**Request Body** (all fields optional, at least one required):
```json
{
  "Name": "string",           // Optional, max 64 chars
  "Email": "string",          // Optional, valid email format
  "Password": "string",       // Optional
  "Address": "string",        // Optional, max 256 chars
  "PhoneNumber": "string",    // Optional, max 256 chars
  "Gender": "string"          // Optional, max 32 chars
}
```

**Response** (200):
```json
{
  "message": "User updated successfully",
  "user": { /* updated user object */ }
}
```

---

#### Change Password (Self)
```
POST /api/users/change_password
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "currentPassword": "string",  // Required
  "newPassword": "string"       // Required
}
```

**Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

---

#### Upload Profile Picture
```
POST /api/users/me/upload-profile
```
**Authentication**: Required (User)

**Content-Type**: `multipart/form-data`

**Request Body**:
```
image: File                   // Required, sent as form-data
userId: string                // Optional (defaults to authenticated user)
```

**Response** (200):
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://cloudinary.com/...",
  "publicId": "cloudinary_public_id"
}
```

---

#### Delete Profile Picture
```
POST /api/users/me/delete-profile
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "userId": "string"          // Optional (defaults to authenticated user)
}
```

**Response** (200):
```json
{
  "message": "Image deleted successfully"
}
```

---

### Admin Routes

#### Check Admin Access
```
GET /api/users/admin/check
```
**Authentication**: Required (Admin)

**Response** (200):
```json
{
  "data": "OK"
}
```

---

#### Get All Users / Search Users
```
GET /api/users?page=1&limit=10&search=query
```
**Authentication**: Required (Admin)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by email, User_Id, or name

**Response** (200):
```json
{
  "totalPage": 5,
  "total": 50,
  "data": [
    {
      "User_Id": "U0000001",
      "Name": "string",
      "Email": "string",
      "Address": "string",
      "PhoneNumber": "string",
      "Gender": "string",
      "Role": "user"
    }
  ]
}
```

---

#### Create User (Admin)
```
POST /api/users
```
**Authentication**: Required (Admin)

**Request Body**: Same as `/api/users/register`

---

#### Update User (Admin)
```
PUT /api/users/:id
```
**Authentication**: Required (Admin)

**Request Body**: Same as `/api/users/me`

---

#### Delete User
```
DELETE /api/users/:id
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

---

#### Change User Password (Admin)
```
POST /api/users/:id/change_password
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "newPassword": "string"     // Required
}
```

**Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

---

## 2. CATEGORY ROUTES
**Base Path**: `/api/categories`

### Public Routes

#### Get All Categories
```
GET /api/categories?page=1&limit=10&search=query
```
**Authentication**: None (Public)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by category name

**Response** (200):
```json
{
  "totalPage": 3,
  "total": 25,
  "data": [
    {
      "Category_Id": 1,
      "Name": "string",
      "Description": "string",
      "Photo_Id": "string",
      "Photo_URL": "string"
    }
  ]
}
```

---

#### Get Category by ID
```
GET /api/categories/:id
```
**Authentication**: None (Public)

**Response** (200):
```json
{
  "Category_Id": 1,
  "Name": "string",
  "Description": "string",
  "Photo_Id": "string",
  "Photo_URL": "string"
}
```

---

### Admin Routes

#### Create Category
```
POST /api/categories
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "string",           // Required
  "description": "string",    // Optional
  "Photo_Id": "string",       // Optional
  "Photo_URL": "string"       // Optional
}
```

**Response** (201):
```json
{
  "message": "Category created successfully",
  "id": 1
}
```

---

#### Update Category
```
PUT /api/categories/:id
```
**Authentication**: Required (Admin)

**Request Body** (all fields optional):
```json
{
  "name": "string",
  "description": "string",
  "Photo_Id": "string",
  "Photo_URL": "string"
}
```

**Response** (200):
```json
{
  "message": "Category with ID 1 updated successfully"
}
```

---

#### Delete Category
```
DELETE /api/categories/:id
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Category with ID 1 deleted successfully"
}
```

---

#### Upload Category Image
```
POST /api/categories/upload-image
```
**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Request Body**:
```
image: File                   // Required
categoryId: string            // Optional
```

**Response** (200):
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://cloudinary.com/...",
  "publicId": "cloudinary_public_id"
}
```

---

#### Delete Category Image
```
POST /api/categories/delete-image
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "categoryId": "string"      // Required
}
```

**Response** (200):
```json
{
  "message": "Image deleted successfully"
}
```

---

## 3. PRODUCT ROUTES
**Base Path**: `/api/products`

### Public Routes

#### Get All Products
```
GET /api/products?page=1&limit=10&search=query&category=1
```
**Authentication**: None (Public)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by product name
- `category` (optional): Filter by category ID

**Response** (200):
```json
{
  "totalPage": 10,
  "total": 100,
  "data": [
    {
      "Product_Id": "P0000001",
      "Index": 1,
      "Name": "string",
      "Author": "string",
      "Description": "string",
      "Price": 100000,
      "Photo_Id": "string",
      "Photo_URL": "string",
      "Category_Id": 1
    }
  ]
}
```

---

#### Get Product by ID
```
GET /api/products/:id
```
**Authentication**: None (Public)

**Response** (200):
```json
{
  "Product_Id": "P0000001",
  "Index": 1,
  "Name": "string",
  "Author": "string",
  "Description": "string",
  "Price": 100000,
  "Photo_Id": "string",
  "Photo_URL": "string",
  "Category_Id": 1
}
```

---

### Admin Routes

#### Create Product
```
POST /api/products
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "Name": "string",           // Required
  "Author": "string",         // Required
  "Description": "string",    // Optional
  "Price": 100000,            // Required, positive number (VND)
  "Photo_Id": "string",       // Optional
  "Photo_URL": "string",      // Optional
  "Category_Id": 1            // Optional, must be valid integer
}
```

**Response** (201):
```json
{
  "message": "Product created successfully",
  "product": {
    "Product_Id": "P0000001",
    "Name": "string",
    "Author": "string",
    "Price": 100000
  }
}
```

---

#### Update Product
```
PUT /api/products/:id
```
**Authentication**: Required (Admin)

**Request Body** (all fields optional, at least one required):
```json
{
  "Name": "string",
  "Author": "string",
  "Description": "string",
  "Price": 100000,            // Positive number (VND)
  "Photo_Id": "string",
  "Category_Id": 1            // Valid integer
}
```

**Response** (200):
```json
{
  "message": "Product updated successfully",
  "data": { /* updated product object */ }
}
```

---

#### Delete Product
```
DELETE /api/products/:id
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Product deleted successfully"
}
```

---

#### Upload Product Image
```
POST /api/products/upload-image
```
**Authentication**: Required (Admin)

**Content-Type**: `multipart/form-data`

**Request Body**:
```
image: File                   // Required
productId: string             // Optional
```

**Response** (200):
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://cloudinary.com/...",
  "publicId": "cloudinary_public_id"
}
```

---

#### Delete Product Image
```
POST /api/products/delete-image
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "productId": "string"       // Required
}
```

**Response** (200):
```json
{
  "message": "Image deleted successfully"
}
```

---

## 4. CART ROUTES
**Base Path**: `/api/carts`

All cart routes require authentication.

### Cart Item Routes

#### Get Cart Details
```
GET /api/carts/details
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Cart details fetched successfully",
  "data": {
    "Cart_Id": 1,
    "User_Id": "U0000001",
    "Status": "active",
    "items": [
      {
        "Cart_Item_Id": 1,
        "Cart_Id": 1,
        "Product_Index": 1,
        "Quantity": 2,
        "product": {
          "Product_Id": "P0000001",
          "Index": 1,
          "Name": "string",
          "Description": "string",
          "Price": 100000,
          "Photo_Id": "string"
        }
      }
    ]
  }
}
```

---

#### Add Item to Cart
```
POST /api/carts/items/:productId
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "quantity": 2               // Required, positive number >= 1
}
```

**Response** (201):
```json
{
  "message": "Cart item created successfully",
  "data": {
    "Cart_Item_Id": 1,
    "Cart_Id": 1,
    "Product_Index": 1,
    "Quantity": 2
  }
}
```

**Note**: If the item already exists in the cart, the quantity will be added to the existing quantity.

---

#### Update Cart Item Quantity
```
PUT /api/carts/items/:productId
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "quantity": 5               // Required, positive number >= 1
}
```

**Response** (200):
```json
{
  "message": "Cart item updated successfully",
  "data": {
    "Cart_Item_Id": 1,
    "Cart_Id": 1,
    "Product_Index": 1,
    "Quantity": 5
  }
}
```

---

#### Remove Item from Cart
```
DELETE /api/carts/items/:productId
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Cart item deleted successfully"
}
```

---

#### Clear Cart (Remove All Items)
```
DELETE /api/carts/clear
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "message": "All cart items deleted successfully"
}
```

---

### Checkout Routes

#### Validate Cart Stock
```
POST /api/carts/validate-stock
```
**Authentication**: Required (User)

**Request Body**: Empty object `{}`

**Response** (200):
```json
{
  "message": "All items in stock",
  "validationResults": [
    {
      "productId": "P0000001",
      "productName": "string",
      "requestedQuantity": 2,
      "availableQuantity": 10,
      "isValid": true
    }
  ]
}
```

**Response** (400) - If stock insufficient:
```json
{
  "error": "Some items have insufficient stock",
  "validationResults": [
    {
      "productId": "P0000001",
      "productName": "string",
      "requestedQuantity": 10,
      "availableQuantity": 5,
      "isValid": false,
      "error": "Insufficient stock"
    }
  ]
}
```

---

#### Get Cart Summary
```
GET /api/carts/summary
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "cartId": 1,
  "userId": "U0000001",
  "totalItems": 3,
  "totalAmount": 350000,
  "items": [
    {
      "productId": "P0000001",
      "productName": "string",
      "quantity": 2,
      "price": 100000,
      "subtotal": 200000
    }
  ]
}
```

---

## 5. ORDER ROUTES
**Base Path**: `/api/orders`

All order routes require authentication.

### User Order Routes

#### Get All Orders (User's Own)
```
GET /api/orders/all?page=1&limit=10&status=pending
```
**Authentication**: Required (User)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "totalPage": 5,
  "total": 48,
  "data": [
    {
      "Order_Id": 1,
      "User_Id": "U0000001",
      "Date": "2026-01-03T10:00:00.000Z",
      "Status": "pending",
      "Amount": 250000,
      "Shipping_Address": "string",
      "items": [
        {
          "Order_Item_Id": 1,
          "Order_Id": 1,
          "Product_Index": 1,
          "Quantity": 2,
          "Amount": 100000,
          "product": {
            "Product_Id": "P0000001",
            "Name": "string",
            "Price": 100000
          }
        }
      ]
    }
  ]
}
```

---

#### Get Order Detail
```
GET /api/orders/:orderId
```
**Authentication**: Required (User)

**Response** (200):
```json
{
  "data": {
    "Order_Id": 1,
    "User_Id": "U0000001",
    "Date": "2026-01-03T10:00:00.000Z",
    "Status": "pending",
    "Amount": 250000,
    "Shipping_Address": "string",
    "items": [ /* array of order items */ ]
  }
}
```

---

#### Cancel Order (User)
```
PUT /api/orders/cancel/:orderId
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "newStatus": "cancelled"    // Required, must be 'pending' or 'cancelled'
}
```

**Response** (200):
```json
{
  "message": "Order updated successfully",
  "order": { /* updated order object */ }
}
```

**Note**: Users can only toggle between 'pending' and 'cancelled' statuses.

---

#### Delete Order (User)
```
DELETE /api/orders/delete/:orderId
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Order deleted successfully"
}
```

**Note**: Users can only delete orders with 'pending' or 'cancelled' status.

---

#### Add Items to Order (User)
```
POST /api/orders/items/:orderId
```
**Authentication**: Required (User)

**Request Body** (single item or array):
```json
{
  "Product_Id": "P0000001",   // Required
  "Quantity": 2               // Required, positive number >= 1
}
```

OR

```json
[
  {
    "Product_Id": "P0000001",
    "Quantity": 2
  },
  {
    "Product_Id": "P0000002",
    "Quantity": 1
  }
]
```

**Response** (201):
```json
{
  "message": "Order items processed successfully",
  "data": {
    "created": [ /* newly created items */ ],
    "updated": [ /* updated items */ ]
  },
  "orderTotal": 350000
}
```

---

#### Update Order Item (User)
```
PUT /api/orders/items/:orderItemId
```
**Authentication**: Required (User)

**Request Body** (at least one required):
```json
{
  "Quantity": 5,              // Optional, positive number >= 1
  "Product_Id": "P0000002"    // Optional
}
```

**Response** (200):
```json
{
  "message": "Order item updated successfully",
  "data": { /* updated order item */ }
}
```

---

#### Delete Order Item (User)
```
DELETE /api/orders/items/:orderItemId
```
**Authentication**: Required (User)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Order item deleted successfully"
}
```

---

### Admin Order Routes

#### Get All Orders (Admin)
```
GET /api/orders/admin?page=1&limit=10&status=pending
GET /api/orders/admin/:userId?page=1&limit=10&status=pending
```
**Authentication**: Required (Admin)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "totalPage": 20,
  "total": 195,
  "data": [
    {
      "Order_Id": 1,
      "User_Id": "U0000001",
      "Date": "2026-01-03T10:00:00.000Z",
      "Status": "pending",
      "Amount": 250000,
      "Shipping_Address": "string"
    }
  ]
}
```

---

#### Update Order (Admin)
```
PUT /api/orders/admin/:id
```
**Authentication**: Required (Admin)

**Request Body** (at least one required):
```json
{
  "Status": "processing",     // Optional, one of: 'pending', 'paid', 'cancelled', 'processing', 'shipped', 'delivered'
  "Amount": 300000            // Optional, non-negative number
}
```

**Response** (200):
```json
{
  "message": "Order updated successfully",
  "order": { /* updated order object */ }
}
```

---

#### Delete Order (Admin)
```
DELETE /api/orders/admin/:id
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Order deleted successfully"
}
```

---

#### Add Items to Order (Admin)
```
POST /api/orders/admin/items/:orderId
```
**Authentication**: Required (Admin)

**Request Body**: Same as user version

---

#### Update Order Item (Admin)
```
PUT /api/orders/admin/items/:id
```
**Authentication**: Required (Admin)

**Request Body**: Same as user version

---

#### Delete Order Item (Admin)
```
DELETE /api/orders/admin/items/:id
```
**Authentication**: Required (Admin)

**Request Body**: None

---

## 6. PAYMENT ROUTES
**Base Path**: `/api/payments`

All payment routes require authentication.

### User Routes

#### Get Payments by Order ID
```
GET /api/payments/order/:orderId?page=1&limit=10&status=completed
```
**Authentication**: Required (User)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response** (200):
```json
{
  "totalPage": 1,
  "total": 1,
  "data": [
    {
      "Payment_Id": 1,
      "Order_Id": 1,
      "User_Id": "U0000001",
      "Type": "credit_card",
      "Amount": 250000,
      "Status": "completed",
      "Date": "2026-01-03T10:00:00.000Z"
    }
  ]
}
```

---

#### Create Payment
```
POST /api/payments
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "orderId": 1,               // Required, valid integer
  "userId": "U0000001",       // Required, non-empty string
  "type": "credit_card",      // Required, one of: 'credit_card', 'paypal', 'bank_transfer'
  "amount": 250000,           // Required, positive number
  "status": "pending"         // Optional, defaults to 'pending'
}
```

**Response** (201):
```json
{
  "message": "Payment created successfully",
  "payment": {
    "Payment_Id": 1,
    "Order_Id": 1,
    "User_Id": "U0000001",
    "Type": "credit_card",
    "Amount": 250000,
    "Status": "pending",
    "Date": "2026-01-03T10:00:00.000Z"
  }
}
```

---

### Admin Routes

#### Get All Payments
```
GET /api/payments?page=1&limit=10&status=completed&userId=U0000001
```
**Authentication**: Required (Admin)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `userId` (optional): Filter by user ID

**Response** (200):
```json
{
  "totalPage": 10,
  "total": 95,
  "data": [ /* array of payment objects */ ]
}
```

---

#### Update Payment
```
PUT /api/payments/:id
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "Status": "completed"       // Optional, one of: 'pending', 'completed', 'failed'
}
```

**Response** (200):
```json
{
  "message": "Payment updated successfully",
  "payment": { /* updated payment object */ }
}
```

**Note**: Cannot change status of a completed payment.

---

#### Delete Payment
```
DELETE /api/payments/:id
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Payment deleted successfully"
}
```

---

## 7. STOCK ROUTES
**Base Path**: `/api/stocks`

### Public Routes

#### Get Stock by Product ID
```
GET /api/stocks/:productId
```
**Authentication**: None (Public)

**Response** (200):
```json
{
  "Stock_Id": 1,
  "Product_Index": 1,
  "Quantity": 100,
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-03T10:00:00.000Z",
  "Last_Updated": "2026-01-03T10:00:00.000Z"
}
```

---

### Admin Routes

#### Get All Stocks
```
GET /api/stocks?page=1&limit=10&filter=low
```
**Authentication**: Required (Admin)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `filter` (optional): 
  - `low`: Items with quantity <= 5
  - `out`: Items with quantity <= 0
  - `<number>`: Items with quantity <= specified number

**Response** (200):
```json
{
  "total": 50,
  "data": [
    {
      "Stock_Id": 1,
      "Product_Index": 1,
      "Quantity": 100,
      "Product_Id": "P0000001",
      "Product_Name": "string",
      "Product_Price": 100000,
      "Photo_URL": "string",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-03T10:00:00.000Z"
    }
  ]
}
```

---

#### Create/Update Stock
```
POST /api/stocks
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "productId": "P0000001",    // Required
  "quantity": 100             // Required, non-negative integer
}
```

**Response** (200 or 201):
```json
{
  "message": "Stock updated successfully",
  "data": {
    "Stock_Id": 1,
    "Product_Index": 1,
    "Quantity": 100,
    "Last_Updated": "2026-01-03T10:00:00.000Z"
  }
}
```

**Note**: Creates new stock if it doesn't exist, updates if it does.

---

#### Adjust Stock Quantity
```
PUT /api/stocks/:productId
```
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "change": 10                // Required, positive to add, negative to subtract
}
```

**Response** (200):
```json
{
  "message": "Stock quantity updated successfully",
  "data": {
    "Stock_Id": 1,
    "Product_Index": 1,
    "Quantity": 110,
    "Last_Updated": "2026-01-03T10:00:00.000Z"
  }
}
```

**Note**: Returns 400 error if the change would result in negative stock.

---

#### Delete Stock
```
DELETE /api/stocks/:productId
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "message": "Stock deleted successfully"
}
```

---

## 8. STRIPE/PAYMENT GATEWAY ROUTES
**Base Path**: `/api/payment-gateway`

### Create Checkout Session
```
POST /api/payment-gateway/create-checkout-session
```
**Authentication**: Required (User)

**Request Body**:
```json
{
  "Shipping_Address": "123 Main St, City, Country",  // Optional
  "shipping_address": "123 Main St, City, Country"   // Alternative field name
}
```

**Note**: 
- If no shipping address is provided, the user's default address from their profile will be used.
- This endpoint processes the user's active cart automatically.
- Creates an order with status 'pending'.
- Clears the cart items after creating the order.
- Does NOT deduct stock yet (stock is deducted after successful payment).

**Response** (200):
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Errors**:
- 400: Cart is empty or shipping address not available
- 400: Insufficient stock for one or more items

---

### Payment Success Callback
```
GET /api/payment-gateway/payment-success?session_id={CHECKOUT_SESSION_ID}
```
**Authentication**: None (Stripe callback)

**Query Parameters**:
- `session_id` (required): Stripe checkout session ID

**Response**: Redirects to customer frontend payment success page
```
Redirect: {CLIENT_URL}/payment-success?order_id={orderId}&session_id={sessionId}
```

**Note**: 
- This endpoint is called by Stripe after successful payment.
- Updates order status from 'pending' to 'paid'.
- Deducts stock for all items in the order.

---

## 9. DASHBOARD ROUTES
**Base Path**: `/api/admin/dashboard`

All dashboard routes require admin authentication.

### Get Admin Dashboard Summary
```
GET /api/admin/dashboard
```
**Authentication**: Required (Admin)

**Request Body**: None

**Response** (200):
```json
{
  "totalUsers": 150,
  "totalProducts": 500,
  "totalOrders": 1250,
  "totalRevenue": 125000000,
  "recentOrders": [
    {
      "Order_Id": 100,
      "User_Id": "U0000001",
      "Date": "2026-01-03T10:00:00.000Z",
      "Status": "delivered",
      "Amount": 350000
    }
  ],
  "ordersToday": 25,
  "lowStockCount": 15
}
```

---

### Get Best Sellers
```
GET /api/admin/dashboard/best-sellers?limit=6
```
**Authentication**: Required (Admin)

**Query Parameters**:
- `limit` (optional): Number of items to return (default: 6)

**Response** (200):
```json
[
  {
    "Product_Index": 1,
    "totalQuantity": 150,
    "Index": 1,
    "Product_Id": "P0000001",
    "Name": "Product Name",
    "Price": 100000,
    "Photo_URL": "https://..."
  }
]
```

**Note**: Aggregates quantities from orders with status 'delivered', 'shipped', or 'paid'.

---

### Get Insights
```
GET /api/admin/dashboard/insights?start=2026-01-01&end=2026-01-31&groupBy=day&resources=orders,revenue,products
```
**Authentication**: Required (Admin)

**Query Parameters**:
- `start` (optional): Start date (ISO format, default: 7 days ago)
- `end` (optional): End date (ISO format, default: today)
- `groupBy` (optional): Grouping interval - 'day' or 'month' (default: 'day')
- `resources` (optional): Comma-separated list of resources to include (default: 'orders,revenue,products')

**Response** (200):
```json
{
  "orders": {
    "2026-01-01": 15,
    "2026-01-02": 20,
    "2026-01-03": 18
  },
  "revenue": {
    "2026-01-01": 1500000,
    "2026-01-02": 2000000,
    "2026-01-03": 1800000
  },
  "products": {
    "2026-01-01": 45,
    "2026-01-02": 60,
    "2026-01-03": 54
  }
}
```

**Notes**:
- `orders`: Number of orders created per day
- `revenue`: Sum of completed payments per day
- `products`: Number of products sold (from delivered/shipped/paid orders) per day

---

## Common Response Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or validation failed
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions (not admin)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., duplicate email)
- **500 Internal Server Error**: Server error

---

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

The token is returned when you login or register:
- `POST /api/users/login`
- `POST /api/users/register`

---

## Valid Status Values

### Order Status
- `pending` - Order created, awaiting payment
- `paid` - Payment received
- `cancelled` - Order cancelled
- `processing` - Order being processed
- `shipped` - Order shipped
- `delivered` - Order delivered

### Payment Status
- `pending` - Payment pending
- `completed` - Payment completed
- `failed` - Payment failed

### Payment Type
- `credit_card`
- `paypal`
- `bank_transfer`

### Cart Status
- `active` - Currently active cart
- `completed` - Cart has been checked out

---

## Pagination

Most list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Paginated responses include:
```json
{
  "totalPage": 10,
  "total": 95,
  "data": [ /* array of items */ ]
}
```

---

## Error Response Format

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

Or with additional details:
```json
{
  "error": "Validation failed",
  "details": [
    "Name is required",
    "Email must be valid"
  ]
}
```

---

## Notes

1. **Currency**: All prices and amounts are in Vietnamese Dong (VND) as integers.
2. **Product IDs**: Format is `P0000001` (P + 7 digits)
3. **User IDs**: Format is `U0000001` (U + 7 digits)
4. **Date Format**: ISO 8601 format (`2026-01-03T10:00:00.000Z`)
5. **File Uploads**: Use `multipart/form-data` content type
6. **Stock Management**: Stock is managed by Product_Index (internal), but accessed via Product_Id (public)
7. **Cart Auto-Creation**: A cart is automatically created when a user registers
8. **Order Amount**: Automatically calculated based on order items

---

## Environment Variables Required

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

**Last Updated**: January 3, 2026
**API Version**: 1.0

---

# CUSTOMER-SIDE API CALLS ANALYSIS

This section documents all API calls made from the customer frontend application, showing the exact data structures and value types being sent in request payloads.

---

## Overview

The customer application uses a centralized API client (`services/api.js`) with axios for all HTTP requests. All API calls are wrapped in service modules organized by domain.

**Base Configuration**:
- Base URL: `http://localhost:3000/api` (configurable via `VITE_API_BASE`)
- Authentication: JWT token from localStorage, sent as `Authorization: Bearer {token}`
- Content-Type: `application/json`
- Timeout: 10 seconds
- Retry Logic: Up to 2 retries for network errors

---

## 1. USER SERVICE (`userService.js`)

### Update Profile
**Function**: `updateProfile(userData)`

**Frontend Call**:
```javascript
await updateProfile({
  fullName: "John Doe",      // string
  phone: "0123456789",       // string
  gender: "Nam",             // string - one of: "Nam", "Nữ", "Khác"
  address: "123 Main St"     // string
});
```

**Transformed Payload Sent to API**:
```json
{
  "Name": "John Doe",         // string (transformed from fullName)
  "PhoneNumber": "0123456789", // string (transformed from phone)
  "Gender": "Nam",            // string
  "Address": "123 Main St"    // string
}
```

**API Endpoint**: `PUT /api/users/me`

**Notes**:
- Frontend uses camelCase, backend expects PascalCase
- Transformation happens in the service layer
- Used in: `pages/Account.jsx`

---

## 2. AUTH CONTEXT (`contexts/AuthContext.jsx`)

### Login
**Function**: `login(email, password)`

**Payload Sent**:
```json
{
  "Email": "user@example.com",  // string - email format
  "Password": "password123"      // string
}
```

**API Endpoint**: `POST /api/users/login`

**Usage Example**:
```javascript
const result = await login("user@example.com", "password123");
// Returns: { success: true } or { success: false, message: "error" }
```

---

### Register
**Function**: `register(userData)`

**Frontend Input**:
```javascript
await register({
  name: "John Doe",           // string (or Name)
  email: "user@example.com",  // string
  password: "password123",    // string
  phone: "0123456789",        // string
  address: "123 Main St",     // string (optional, defaults to "Chưa cập nhật")
  gender: "Nam"               // string
});
```

**Payload Sent**:
```json
{
  "Name": "John Doe",              // string
  "Email": "user@example.com",     // string
  "Password": "password123",       // string
  "PhoneNumber": "0123456789",     // string
  "Address": "123 Main St",        // string (defaults to "Chưa cập nhật" if not provided)
  "Gender": "Nam"                  // string
}
```

**API Endpoint**: `POST /api/users/register`

---

### Get Current User
**Function**: Auto-called on app load

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/users/me`

---

## 3. CART SERVICE (`cartService.js`)

### Get My Cart
**Function**: `getMyCart()`

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/carts/items`

**Note**: Actually calls `/api/carts/details` based on the route, but service uses `/items`

**Used in**: `contexts/CartContext.jsx`

---

### Add to Cart
**Function**: `addToCart(productId, quantity)`

**Payload Sent**:
```json
{
  "quantity": 1  // number - positive integer >= 1
}
```

**API Endpoint**: `POST /api/carts/items/:productId`

**Usage Example**:
```javascript
await addToCart("P0000001", 1);
// Adds 1 unit of product P0000001 to cart
```

**Used in**: 
- `contexts/CartContext.jsx`
- `components/BookCard.jsx`

---

### Update Cart Item
**Function**: `updateCartItem(productId, quantity)`

**Payload Sent**:
```json
{
  "quantity": 5  // number - positive integer >= 1
}
```

**API Endpoint**: `PUT /api/carts/items/:productId`

**Usage Example**:
```javascript
await updateCartItem("P0000001", 5);
// Updates product P0000001 quantity to 5
```

**Used in**: `contexts/CartContext.jsx`

---

### Remove Cart Item
**Function**: `removeCartItem(productId)`

**Payload Sent**: None (DELETE request)

**API Endpoint**: `DELETE /api/carts/items/:productId`

**Used in**: `contexts/CartContext.jsx`

---

### Clear Cart
**Function**: `clearCart()`

**Payload Sent**: None (DELETE request)

**API Endpoint**: `DELETE /api/carts/clear`

**Used in**: 
- `contexts/CartContext.jsx`
- `pages/CheckoutPage.jsx`

---

## 4. PRODUCT SERVICE (`productService.js`)

### Get Products
**Function**: `getProducts(params)`

**Payload Sent**: None (GET request with query params)

**Query Parameters**:
```javascript
{
  page: 1,              // number - default: 1
  limit: 10,            // number - default: 10
  search: "keyword",    // string - optional
  category: 1           // number/string - optional, category ID
}
```

**API Endpoint**: `GET /api/products?page=1&limit=10&search=keyword&category=1`

**Usage Examples**:
```javascript
// Get all products, page 1
await getProducts({ page: 1, limit: 12 });

// Search products
await getProducts({ search: "Harry Potter", page: 1, limit: 10 });

// Filter by category
await getProducts({ category: 2, page: 1, limit: 10 });
```

**Used in**:
- `pages/Home.jsx`
- `pages/BookList.jsx`

---

### Get Product by ID
**Function**: `getProductById(productId)`

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/products/:productId`

**Usage Example**:
```javascript
await getProductById("P0000001");
```

**Used in**:
- `pages/BookDetail.jsx`
- `pages/BookDetailEnhanced.jsx`

---

## 5. CATEGORY SERVICE (`categoryService.js`)

### Get Categories
**Function**: `getCategories(params)`

**Payload Sent**: None (GET request with query params)

**Query Parameters**:
```javascript
{
  page: 1,        // number - default: 1
  limit: 100,     // number - default: 100 (high limit for menu display)
  search: "text"  // string - optional
}
```

**API Endpoint**: `GET /api/categories?page=1&limit=100&search=text`

**Used in**: `pages/Home.jsx`

---

### Get Category by ID
**Function**: `getCategoryById(id)`

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/categories/:id`

**Used in**:
- `pages/BookList.jsx`
- `pages/BookDetailEnhanced.jsx`

---

## 6. ORDER SERVICE (`orderService.js`)

### Get My Orders
**Function**: `getMyOrders(userId, page, limit)`

**Payload Sent**: None (GET request with query params)

**Query Parameters**:
```javascript
{
  page: 1,   // number - default: 1
  limit: 5   // number - default: 5
}
```

**API Endpoint**: `GET /api/orders/all?page=1&limit=5`

**Notes**:
- `userId` parameter is kept for backwards compatibility but not used
- User ID comes from JWT token in Authorization header

**Used in**: `components/OrderList.jsx`

---

### Get Order by ID
**Function**: `getOrderById(id)`

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/orders/:id`

---

### Create Order (Legacy - Not Currently Used)
**Function**: `createOrder(userId, orderData)`

**Payload Sent**:
```json
{
  "Shipping_Address": "123 Main St, City, Country",  // string
  "Payment_Method": "cod",                            // string
  "items": [
    {
      "Product_Id": "P0000001",  // string
      "Quantity": 2              // number
    }
  ]
}
```

**API Endpoint**: `POST /api/orders/:userId`

**Note**: This function exists but is not currently used in the application. Checkout uses Stripe gateway instead.

---

## 7. PAYMENT SERVICE (`paymentService.js`)

### Create Checkout Session
**Function**: `createCheckoutSession()`

**Payload Sent**: Empty object `{}`

**API Endpoint**: `POST /api/payment-gateway/create-checkout-session`

**Response**:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Usage Flow**:
1. User clicks "Pay with Stripe" on checkout page
2. Frontend calls `createCheckoutSession()`
3. Backend creates order from cart, generates Stripe session
4. Frontend redirects to Stripe's checkout URL
5. After payment, Stripe redirects back to success page

**Used in**: `pages/CheckoutPage.jsx`

**Notes**:
- No shipping address sent in body (uses user's default address)
- Cart is automatically processed by backend middleware
- Order is created with status 'pending'
- Cart is cleared after order creation

---

### Get Payment by Order ID
**Function**: `getPaymentByOrderId(orderId)`

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/payments/order/:orderId`

---

### Create Payment (Legacy - Not Currently Used)
**Function**: `createPayment(paymentData)`

**Payload Sent**:
```json
{
  "orderId": 1,                  // number
  "userId": "U0000001",          // string
  "type": "credit_card",         // string - one of: 'credit_card', 'paypal', 'bank_transfer'
  "amount": 250000,              // number
  "status": "pending"            // string - optional
}
```

**API Endpoint**: `POST /api/payments`

**Note**: This function exists but is not currently used. Payment is handled via Stripe checkout.

---

## 8. STOCK SERVICE (`stockService.js`)

### Get Stock by Product ID
**Function**: `getStockByProductId(productId)`

**Payload Sent**: None (GET request)

**API Endpoint**: `GET /api/stocks/:productId`

**Used in**:
- `pages/BookDetail.jsx`
- `pages/BookDetailEnhanced.jsx`

---

### Check Product Availability
**Function**: `checkProductAvailability(productId, requestedQuantity)`

**Payload Sent**: None (GET request internally calls getStockByProductId)

**Logic**:
```javascript
// Fetches stock and checks if available quantity >= requested quantity
const stock = await getStockByProductId(productId);
return stock && stock.Quantity >= requestedQuantity;
```

**Returns**: `boolean` - true if stock available, false otherwise

---

## 9. CHECKOUT FLOW (`pages/CheckoutPage.jsx`)

The checkout page handles two payment methods:

### Option 1: Stripe Payment (Current Implementation)

**Flow**:
```javascript
// 1. User selects "Stripe" payment method
// 2. Form submission calls createCheckoutSession()
const stripeSession = await createCheckoutSession();

// 3. No additional payload sent
// Request: POST /api/payment-gateway/create-checkout-session
// Body: {} (empty)

// 4. Backend processes cart automatically and returns Stripe URL
// Response: { url: "https://checkout.stripe.com/..." }

// 5. Frontend redirects to Stripe
window.location.href = stripeSession.url;
```

**Backend Processing** (automatic):
- Validates cart has items
- Checks stock availability
- Creates order with items from cart
- Clears cart items
- Creates Stripe checkout session
- Returns Stripe URL

---

### Option 2: COD Payment (Legacy - Code Exists but Unused)

**Payload That Would Be Sent**:
```json
{
  "Shipping_Address": "123 Main St, City, Vietnam",  // string - formatted from form
  "Payment_Method": "cod",                            // string
  "items": [
    {
      "Product_Id": "P0000001",  // string
      "Quantity": 2              // number
    },
    {
      "Product_Id": "P0000002",
      "Quantity": 1
    }
  ]
}
```

**Note**: This code path exists in `CheckoutPage.jsx` but the backend endpoint for creating orders directly doesn't match the frontend implementation. Current production flow uses Stripe only.

---

## Data Type Summary

### Common Data Types Used in Customer API Calls

| Field | Type | Example Values | Notes |
|-------|------|----------------|-------|
| **User Fields** |
| Name | string | "John Doe" | Max 64 chars |
| Email | string | "user@example.com" | Valid email format |
| Password | string | "password123" | Sent only on login/register |
| PhoneNumber | string | "0123456789" | Max 256 chars |
| Gender | string | "Nam", "Nữ", "Khác" | Vietnamese gender options |
| Address | string | "123 Main St" | Max 256 chars |
| **Cart Fields** |
| quantity | number | 1, 5, 10 | Positive integer >= 1 |
| Product_Id | string | "P0000001" | Format: P + 7 digits |
| **Product/Category Fields** |
| page | number | 1, 2, 3 | Positive integer |
| limit | number | 10, 12, 100 | Positive integer |
| search | string | "Harry Potter" | Search keyword |
| category | number/string | 1, "2" | Category ID |
| **Order Fields** |
| Shipping_Address | string | "123 Main St, City, Country" | Full address string |
| Payment_Method | string | "cod", "stripe" | Payment method identifier |
| items | array | `[{Product_Id, Quantity}]` | Array of order items |

---

## Field Name Transformations

The customer frontend uses **camelCase** while the backend expects **PascalCase**. Transformations happen in service layers:

| Frontend (camelCase) | Backend (PascalCase) |
|---------------------|---------------------|
| fullName | Name |
| phone | PhoneNumber |
| gender | Gender |
| address | Address |
| email | Email |
| password | Password |
| quantity | quantity (lowercase - exception) |

---

## Authentication Flow

1. **Login/Register**: User submits credentials
2. **Token Storage**: JWT token saved to `localStorage.getItem("token")`
3. **Auto-Attach**: Axios interceptor adds `Authorization: Bearer {token}` to all requests
4. **Auto-Load User**: On app mount, fetches `/api/users/me` if token exists
5. **Logout**: Removes token from localStorage and clears user state

---

## Error Handling

All API calls use consistent error handling:

```javascript
try {
  const response = await apiFunction();
  // Success handling
} catch (error) {
  // error.message contains user-friendly error message
  // error.response.data contains server error details
  console.error("API Error:", error);
}
```

**Retry Logic**:
- Network errors are retried up to 2 times
- Retry delay: 1 second, 2 seconds
- Server errors (4xx, 5xx) are not retried

---

## Unused/Legacy Code

The following functions exist in services but are not currently used in the application:

1. **`createOrder()`** in `orderService.js` - Replaced by Stripe checkout flow
2. **`createPayment()`** in `paymentService.js` - Payment handled by Stripe
3. **COD payment flow** in `CheckoutPage.jsx` - Only Stripe is actively used

---

## Component Usage Map

| Service Function | Used In Components |
|-----------------|-------------------|
| **User Service** |
| `updateProfile()` | `pages/Account.jsx` |
| **Auth Context** |
| `login()` | Login components |
| `register()` | Register components |
| `apiFetch("/users/me")` | `AuthContext.jsx` (auto-load) |
| **Cart Service** |
| `getMyCart()` | `CartContext.jsx` |
| `addToCart()` | `CartContext.jsx`, `BookCard.jsx` |
| `updateCartItem()` | `CartContext.jsx` |
| `removeCartItem()` | `CartContext.jsx` |
| `clearCart()` | `CartContext.jsx`, `CheckoutPage.jsx` |
| **Product Service** |
| `getProducts()` | `Home.jsx`, `BookList.jsx` |
| `getProductById()` | `BookDetail.jsx`, `BookDetailEnhanced.jsx` |
| **Category Service** |
| `getCategories()` | `Home.jsx` |
| `getCategoryById()` | `BookList.jsx`, `BookDetailEnhanced.jsx` |
| **Order Service** |
| `getMyOrders()` | `OrderList.jsx` |
| **Payment Service** |
| `createCheckoutSession()` | `CheckoutPage.jsx` |
| **Stock Service** |
| `getStockByProductId()` | `BookDetail.jsx`, `BookDetailEnhanced.jsx` |

---

## API Call Frequency

**High Frequency** (Multiple calls per page):
- `GET /api/products` - Product listings
- `GET /api/carts/details` - Cart updates
- `GET /api/categories` - Category navigation

**Medium Frequency**:
- `GET /api/stocks/:productId` - Product detail pages
- `GET /api/users/me` - Auth refresh
- `POST /api/carts/items/:productId` - Add to cart

**Low Frequency**:
- `POST /api/payment-gateway/create-checkout-session` - Checkout only
- `PUT /api/users/me` - Profile updates
- `GET /api/orders/all` - Order history

---

## Validation Notes

**Client-side Validation**:
- Email format checked in HTML5 input type="email"
- Required fields enforced with HTML5 required attribute
- Gender restricted to radio button selection
- Quantity must be positive number

**Server-side Validation** (see Server API docs):
- All validations re-checked on server
- Data type validation
- String length limits
- Business logic validation (stock availability, etc.)

---

**Customer-Side Analysis Completed**: January 3, 2026

---

# CLIENT-SERVER MISMATCH FIXES

**Last Updated**: January 3, 2026  
**Status**: ✅ All Critical Issues Fixed

## Summary of Issues Found & Fixed

### 🔴 Critical Issue 1: Cart Endpoint Mismatch (FIXED)
- **Problem**: Client called `GET /api/carts/items` but server expects `GET /api/carts/details`
- **Impact**: Cart functionality completely broken
- **Fix**: Changed endpoint in `customer/src/services/cartService.js` from `/carts/items` to `/carts/details`
- **File Modified**: `customer/src/services/cartService.js`

### 🟡 Medium Issue 2: Missing Shipping Address (FIXED)
- **Problem**: Checkout sent empty body `{}` instead of including shipping address
- **Impact**: Always used user's default address; couldn't specify different shipping address
- **Fix**: Modified `createCheckoutSession()` to accept and send optional shipping address
- **Files Modified**: 
  - `customer/src/services/paymentService.js`
  - `customer/src/pages/CheckoutPage.jsx`

### 🔴 Critical Issue 3: Broken COD Payment Flow (FIXED)
- **Problem**: Client attempted `POST /api/orders/:userId` which doesn't exist on server
- **Impact**: COD payment would fail silently
- **Fix**: Removed broken COD flow, display clear error message if user selects COD
- **File Modified**: `customer/src/pages/CheckoutPage.jsx`

## All Other Endpoints Verified ✅

The following endpoints were verified to have correct payload structures:
- ✅ User login, register, profile update
- ✅ Cart add, update, remove, clear
- ✅ Product listing, search, filtering
- ✅ Category listing
- ✅ Order history retrieval
- ✅ Stock checking

## Type Compliance ✅

All payloads now send:
- ✅ Correct data types (string, number as expected)
- ✅ Correct field names (PascalCase for backend)
- ✅ Required fields present
- ✅ Optional fields handled properly

**Detailed Mismatch Report**: See `/CLIENT_SERVER_MISMATCH_REPORT.md` for complete analysis

---

**Customer-Side Analysis Completed**: January 3, 2026
