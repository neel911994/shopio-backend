"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/products/stats - Product stats
router.get("/stats", auth_middleware_1.authenticate, product_controller_1.getStats);
// GET /api/products - List all products
router.get("/", auth_middleware_1.authenticate, product_controller_1.listProducts);
// GET /api/products/:id - Get single product by ID
router.get("/:id", auth_middleware_1.authenticate, product_controller_1.getProduct);
// POST /api/products - Create new product (Admin only)
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ADMIN"), product_controller_1.createProduct);
// PATCH /api/products/:id - Update product (Admin only)
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ADMIN"), product_controller_1.editProduct);
exports.default = router;
