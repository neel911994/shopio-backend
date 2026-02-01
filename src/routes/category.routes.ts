import { Router } from "express";
import * as categoryController from "../controllers/category.controller";

const router = Router();

// GET /api/categories - Get all categories
router.get("/", categoryController.getCategories);

// GET /api/categories/:id - Get category by ID with products
router.get("/:id", categoryController.getCategoryById);

// POST /api/categories - Create new category
router.post("/", categoryController.createCategory);

export default router;
