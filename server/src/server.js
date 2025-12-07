import cors from 'cors';
import express from 'express';
import { connectDB } from "./config/database.js";
import { DATABASE_URL, PORT } from "./config/env.js"; // Load env first!
import { cart_router } from "./routes/cart_route.js";
import { category_router } from './routes/category_route.js';
import { order_router } from "./routes/order_route.js";
import { payment_router } from './routes/payment_route.js';
import { product_router } from "./routes/product_route.js";
import { stock_router } from "./routes/stock_route.js";
import { user_router } from "./routes/user_route.js";

const app = express();

app.use(cors({
  origin: ['http://localhost:5173','http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, Server is running');
});

app.use("/users", user_router);
app.use("/orders", order_router);
app.use("/products", product_router);
app.use("/carts", cart_router);
app.use("/categories", category_router);
app.use("/payments", payment_router);
app.use("/stocks", stock_router);

connectDB(DATABASE_URL).then(async() => {
    app.listen(PORT, () => console.log(`[INFO] Server running on port ${PORT}`));
});