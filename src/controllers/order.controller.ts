import { Request, Response } from "express";
import { getOrders, getOrderById } from "../services/order.service";

export const listOrders = async (req: Request, res: Response) => {
    try {
        const orders = await getOrders();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const order = await getOrderById(id);
        res.json(order);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
