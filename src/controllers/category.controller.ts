import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

// GET /api/categories - Get all categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/categories/:id - Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const category = await categoryService.getCategoryById(id);
        res.json(category);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

// POST /api/categories - Create new category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const category = await categoryService.createCategory(name);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
