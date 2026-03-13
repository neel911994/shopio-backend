import express from "express";
import authRoutes from "./auth/auth.routes";

const app = express();

app.use(express.json()); // REQUIRED for login/signup APIs

app.use("/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
