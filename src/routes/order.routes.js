"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/orders/stats - Order summary stats
router.get("/stats", auth_middleware_1.authenticate, order_controller_1.getStats);
// GET /api/orders - List all orders with query params
router.get("/", auth_middleware_1.authenticate, order_controller_1.listOrders);
// GET /api/orders/:id - Get single order by ID
router.get("/:id", auth_middleware_1.authenticate, order_controller_1.getOrder);
// PATCH /api/orders/:id - Update order status (Admin only)
router.patch("/:id", auth_middleware_1.authenticate, order_controller_1.editOrderStatus);
exports.default = router;
