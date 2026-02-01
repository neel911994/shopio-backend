import { Request, Response } from "express";
import { getProducts, getProductById, updateProduct } from "../services/product.service";

export const listProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
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
