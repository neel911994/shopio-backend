import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Shopio Backend API" });
});

export default app;
