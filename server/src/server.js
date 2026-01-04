import cors from "cors";
import express from "express";
import { connectDB } from "./config/database.js";
import { CORS_ORIGINS, DATABASE_URL, PORT } from "./config/env.js"; // Load env first!
import { cart_router } from "./routes/cart_route.js";
import { category_router } from "./routes/category_route.js";
import { dashboard_router } from "./routes/dashboard_route.js";
import { order_router } from "./routes/order_route.js";
import { payment_router } from "./routes/payment_route.js";
import { product_router } from "./routes/product_route.js";
import { stock_router } from "./routes/stock_route.js";
import { stripeRouter } from "./routes/stripe_route.js";
import { user_router } from "./routes/user_route.js";

const app = express();

const allowedOrigins = Array.isArray(CORS_ORIGINS) ? CORS_ORIGINS : [CORS_ORIGINS];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`[WARN] CORS origin denied: ${origin}`);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/users", user_router);
app.use("/api/orders", order_router);
app.use("/api/products", product_router);
app.use("/api/carts", cart_router);
app.use("/api/categories", category_router);
app.use("/api/payments", payment_router);
app.use("/api/stocks", stock_router);
app.use("/api/payment-gateway", stripeRouter);
app.use("/api/admin/dashboard", dashboard_router);

connectDB(DATABASE_URL).then(async() => {
    app.listen(PORT, () => console.log(`[INFO] Server running on port ${PORT}`));
});
