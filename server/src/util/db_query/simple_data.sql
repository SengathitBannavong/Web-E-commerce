-- User
INSERT INTO "User" ("User_Id", "Name", "Email", "Password", "Address", "PhoneNumber", "Gender") VALUES
('U0000001', 'Alice Smith', 'alice@example.com', 'password123', '123 Main St, New York, NY 10001', '+1-555-0101', 'Female'),
('U0000002', 'Bob Johnson', 'bob@example.com', 'securepass', '456 Oak Ave, Los Angeles, CA 90001', '+1-555-0102', 'Male'),
('U0000003', 'Charlie Brown', 'charlie@example.com', 'charliepass', '789 Pine Rd, Chicago, IL 60601', '+1-555-0103', 'Male');

-- Category
INSERT INTO "Category" ("Name", "Description", "Photo_Id") VALUES
('Fiction', 'Novels and fictional books', 'photo1'),
('Science', 'Books about science', 'photo2'),
('Technology', 'Books about tech and programming', 'photo3');

-- Product
INSERT INTO "Product" ("Product_Id", "Name", "Description", "Price", "Photo_Id", "Category_Id") VALUES
('P0000001', 'The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 9.99, 'photo_gatsby', 1),
('P0000002', 'A Brief History of Time', 'Science book by Stephen Hawking', 14.50, 'photo_time', 2),
('P0000003', 'Learning JavaScript', 'Programming guide for JS beginners', 29.99, 'photo_js', 3);

-- Stock
INSERT INTO "Stock" ("Product_Id", "Quantity", "Last_Updated") VALUES
('P0000001', 50, NOW()),
('P0000002', 30, NOW()),
('P0000003', 20, NOW());

-- Cart
INSERT INTO "Cart" ("User_Id", "Status", "created_at") VALUES
('U0000001', 'active', NOW()),
('U0000002', 'active', NOW());

-- CartItem
INSERT INTO "CartItem" ("Cart_Id", "Product_Id", "Quantity") VALUES
(1, 'P0000001', 1),
(1, 'P0000003', 2),
(2, 'P0000002', 1);

-- Order
INSERT INTO "Order" ("User_Id", "Date", "Status", "Amount") VALUES
('U0000001', NOW(), 'paid', 49.97),
('U0000002', NOW(), 'pending', 14.50);

-- Order_Item
INSERT INTO "Order_Item" ("Order_Id", "Product_Id", "Quantity", "Amount") VALUES
(1, 'P0000001', 1, 9.99),
(1, 'P0000003', 2, 39.98),
(2, 'P0000002', 1, 14.50);

-- Payment
INSERT INTO "Payment" ("Order_Id", "User_Id", "Type", "Amount", "Status") VALUES
(1, 'U0000001', 'credit_card', 49.97, 'completed'),
(2, 'U0000002', 'paypal', 14.50, 'pending');