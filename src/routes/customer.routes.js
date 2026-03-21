"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/customers - List all customers
router.get("/", auth_middleware_1.authenticate, customer_controller_1.listCustomers);
// GET /api/customers/:id - Get single customer by ID
router.get("/:id", auth_middleware_1.authenticate, customer_controller_1.getCustomer);
// PATCH /api/customers/:id/phone - Update customer phone number (Admin only)
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ADMIN"), customer_controller_1.editCustomerPhone);
exports.default = router;
