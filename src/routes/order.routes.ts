import { Router } from "express";
import { listOrders, getOrder } from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/orders - List all orders with query params
router.get("/", authenticate, listOrders);

// GET /api/orders/:id - Get single order by ID
router.get("/:id", authenticate, getOrder);

export default router;
