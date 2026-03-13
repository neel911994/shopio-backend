import { Router } from "express";
import { listCustomers, getCustomer, editCustomerPhone } from "../controllers/customer.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/customers - List all customers
router.get("/", authenticate, listCustomers);

// GET /api/customers/:id - Get single customer by ID
router.get("/:id", authenticate, getCustomer);

// PATCH /api/customers/:id/phone - Update customer phone number (Admin only)
router.patch("/:id", authenticate, authorizeRoles("ADMIN"), editCustomerPhone);

export default router;
