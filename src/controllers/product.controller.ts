import { Request, Response } from "express";
import { getProducts, getProductById, updateProduct, addProduct, getProductStats } from "../services/product.service";

export const getStats = async (_req: Request, res: Response) => {
    try {
        const stats = await getProductStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const listProducts = async (req: Request, res: Response) => {
    try {
        const { categoryId, stockFilter, search, page, limit } = req.query as { categoryId?: string; stockFilter?: 'inStock' | 'lowStock' | 'outOfStock'; search?: string; page?: string; limit?: string };
        const products = await getProducts({ categoryId, stockFilter, search, page: page ? parseInt(page) : undefined, limit: limit ? parseInt(limit) : undefined });
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await getProductById(id);
        res.json(product);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const editProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { stock, isActive } = req.body;
        const product = await updateProduct(id, { stock, isActive });
        res.status(200).json(product);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, categoryId, isActive } = req.body;

        if (!name || !price || !stock || !categoryId) {
            return res.status(400).json({ message: "name, price, stock, and categoryId are required" });
        }

        const product = await addProduct(name, description, price, stock, categoryId, isActive ?? true);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
