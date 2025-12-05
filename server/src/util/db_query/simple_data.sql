-- User
INSERT INTO "User" ("User_Id", "Name", "Email", "Password") VALUES
('U0000001', 'Alice Smith', 'alice@example.com', 'password123'),
('U0000002', 'Bob Johnson', 'bob@example.com', 'securepass'),
('U0000003', 'Charlie Brown', 'charlie@example.com', 'charliepass');

-- Category
INSERT INTO "Category" ("Name", "Description", "Photo_Id") VALUES
('Fiction', 'Novels and fictional books', 'photo1'),
('Science', 'Books about science', 'photo2'),
('Technology', 'Books about tech and programming', 'photo3');

-- Product
INSERT INTO "Product" ("Product_Id", "Name", "Author", "Description", "Price", "Cover_Url", "Category_Id") VALUES
('P0000001', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic novel by F. Scott Fitzgerald', 9.99, '/images/books/gatsby.jpg', 1),
('P0000002', 'A Brief History of Time', 'Stephen Hawking', 'Science book by Stephen Hawking', 14.50, '/images/books/time.jpg', 2),
('P0000003', 'Learning JavaScript', 'Ethan Brown', 'Programming guide for JS beginners', 29.99, '/images/books/js.jpg', 3);

-- Stock
INSERT INTO "Stock" ("Product_Id", "Quantity") VALUES
('P0000001', 50),
('P0000002', 30),
('P0000003', 20);

-- Cart
INSERT INTO "Cart" ("User_Id", "Status") VALUES
('U0000001', 'active'),
('U0000002', 'active');

-- CartItem
INSERT INTO "CartItem" ("Cart_Id", "Product_Id", "Quantity") VALUES
(1, 'P0000001', 1),
(1, 'P0000003', 2),
(2, 'P0000002', 1);

-- Order
INSERT INTO "Order" ("User_Id", "Status", "Amount") VALUES
('U0000001', 'paid', 49.97),
('U0000002', 'pending', 14.50);

-- Order_Item
INSERT INTO "Order_Item" ("Order_Id", "Product_Id", "Quantity", "Amount") VALUES
(1, 'P0000001', 1, 9.99),
(1, 'P0000003', 2, 39.98),
(2, 'P0000002', 1, 14.50);

-- Payment
INSERT INTO "Payment" ("Order_Id", "User_Id", "Type", "Amount", "Status") VALUES
(1, 'U0000001', 'credit_card', 49.97, 'completed'),
(2, 'U0000002', 'paypal', 14.50, 'pending');