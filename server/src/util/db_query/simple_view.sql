CREATE OR REPLACE VIEW get_all_details_cart_by_user AS
SELECT
  c."Cart_Id",
  c."User_Id",
  c."Status",
  c."created_at",
  ci."Cart_Item_Id",
  ci."Product_Id",
  ci."Quantity",
  p."Index",
  p."Name",
  p."Description",
  p."Price",
  p."Photo_Id"
FROM "Cart" AS c
LEFT JOIN "CartItem" AS ci 
ON c."Cart_Id" = ci."Cart_Id"
LEFT JOIN "Product" AS p
ON ci."Product_Id" = p."Product_Id"
WHERE c."User_Id" = 'U0000001' AND c."Status" = 'active'
ORDER BY c."Cart_Id", ci."Cart_Item_Id";


CREATE OR REPLACE VIEW customer_order_summary AS
SELECT 
  c."User_Id",
  c."Name",
  c."Email",
  COUNT(o."Order_Id") AS total_orders,
  COALESCE(SUM(o."Amount"), 0) AS total_spent
FROM "User" c
LEFT JOIN "Order" o ON c."User_Id" = o."User_Id"
GROUP BY c."User_Id", c."Name", c."Email";

CREATE OR REPLACE VIEW order_detail_view AS
SELECT
  o."Order_Id",
  o."User_Id",
  c."Name" AS customer_name,
  p."Name" AS product_name,
  oi."Quantity",
  oi."Amount",
  o."Status",
  o."Date"
FROM "Order" o
JOIN "Order_Item" oi ON o."Order_Id" = oi."Order_Id"
JOIN "Product" p ON oi."Product_Id" = p."Product_Id"
JOIN "User" c ON o."User_Id" = c."User_Id";

CREATE OR REPLACE VIEW product_stock_view AS
SELECT
  p."Product_Id",
  p."Name" AS product_name,
  c."Name" AS category_name,
  p."Price",
  s."Quantity" AS stock_quantity
FROM "Product" p
LEFT JOIN "Category" c ON p."Category_Id" = c."Category_Id"
LEFT JOIN "Stock" s ON p."Product_Id" = s."Product_Id";

CREATE OR REPLACE VIEW user_cart_view AS
SELECT
  cu."User_Id",
  cu."Name" AS customer_name,
  ca."Cart_Id",
  ca."Status",
  p."Name" AS product_name,
  ci."Quantity",
  (ci."Quantity" * p."Price") AS total_price
FROM "Cart" ca
JOIN "User" cu ON ca."User_Id" = cu."User_Id"
JOIN "CartItem" ci ON ca."Cart_Id" = ci."Cart_Id"
JOIN "Product" p ON ci."Product_Id" = p."Product_Id";

CREATE OR REPLACE VIEW product_sales_summary AS
SELECT
  p."Product_Id",
  p."Name" AS product_name,
  SUM(oi."Quantity") AS total_sold,
  SUM(oi."Amount") AS total_revenue
FROM "Product" p
JOIN "Order_Item" oi ON p."Product_Id" = oi."Product_Id"
GROUP BY p."Product_Id", p."Name";


