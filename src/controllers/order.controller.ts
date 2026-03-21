import { Request, Response } from "express";
import { getOrders, getOrderById, updateOrderStatus, getOrderStats } from "../services/order.service";

export const listOrders = async (req: Request, res: Response) => {
    try {
        const { status, customerName, startDate, endDate, page, limit } = req.query;
        const orders = await getOrders({
            status: status as string,
            customerName: customerName as string,
            startDate: startDate as string,
            endDate: endDate as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10
        });
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

export const getStats = async (_req: Request, res: Response) => {
    try {
        const stats = await getOrderStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const editOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status } = req.body;
        const order = await updateOrderStatus(id, status);
        res.status(200).json(order);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
