import { Router } from "express";
import { listProducts, getProduct, editProduct } from "../controllers/product.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/products - List all products
router.get("/", authenticate, listProducts);

// GET /api/products/:id - Get single product by ID
router.get("/:id", authenticate, getProduct);

// PATCH /api/products/:id - Update product (Admin only)
router.patch("/:id", authenticate, authorizeRoles("ADMIN"), editProduct);

export default router;
