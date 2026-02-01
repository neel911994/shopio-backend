import { Router } from "express";
import { listOrders, getOrder, editOrderStatus } from "../controllers/order.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/orders - List all orders with query params
router.get("/", authenticate, listOrders);

// GET /api/orders/:id - Get single order by ID
router.get("/:id", authenticate, getOrder);

// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch("/:id/status", authenticate, editOrderStatus);

export default router;
