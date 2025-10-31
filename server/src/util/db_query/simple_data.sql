-- User
INSERT INTO "User" ("User_Id", "Name", "Email", "Password") VALUES
('USR0001', 'Alice Smith', 'alice@example.com', 'password123'),
('USR0002', 'Bob Johnson', 'bob@example.com', 'securepass'),
('USR0003', 'Charlie Brown', 'charlie@example.com', 'charliepass');

-- Category
INSERT INTO "Category" ("Name", "Description", "Photo_Id") VALUES
('Fiction', 'Novels and fictional books', 'photo1'),
('Science', 'Books about science', 'photo2'),
('Technology', 'Books about tech and programming', 'photo3');

-- Product
INSERT INTO "Product" ("Product_Id", "Name", "Description", "Price", "Photo_Id", "Category_Id") VALUES
('P0001', 'The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 9.99, 'photo_gatsby', 1),
('P0002', 'A Brief History of Time', 'Science book by Stephen Hawking', 14.50, 'photo_time', 2),
('P0003', 'Learning JavaScript', 'Programming guide for JS beginners', 29.99, 'photo_js', 3);

-- Stock
INSERT INTO "Stock" ("Product_Id", "Quantity") VALUES
('P0001', 50),
('P0002', 30),
('P0003', 20);

-- Cart
INSERT INTO "Cart" ("User_Id", "Status") VALUES
('USR0001', 'active'),
('USR0002', 'active');

-- CartItem
INSERT INTO "CartItem" ("Cart_Id", "Product_Id", "Quantity") VALUES
(1, 'P0001', 1),
(1, 'P0003', 2),
(2, 'P0002', 1);

-- Order
INSERT INTO "Order" ("User_Id", "Status", "Amount") VALUES
('USR0001', 'paid', 49.97),
('USR0002', 'pending', 14.50);

-- Order_Item
INSERT INTO "Order_Item" ("Order_Id", "Product_Id", "Quantity", "Amount") VALUES
(1, 'P0001', 1, 9.99),
(1, 'P0003', 2, 39.98),
(2, 'P0002', 1, 14.50);

-- Payment
INSERT INTO "Payment" ("Order_Id", "User_Id", "Type", "Amount", "Status") VALUES
(1, 'USR0001', 'credit_card', 49.97, 'completed'),
(2, 'USR0002', 'paypal', 14.50, 'pending');