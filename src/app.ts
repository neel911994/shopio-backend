import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import kpiRoutes from "./routes/kpi.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import customerRoutes from "./routes/customer.routes";
import categoryRoutes from "./routes/category.routes";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", kpiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Shopio Backend API" });
});

export default app;
