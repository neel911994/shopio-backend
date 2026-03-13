import { Request, Response } from "express";
import { getKpis } from "../services/kpi.service";

export const listKpis = async (req: Request, res: Response) => {
    try {
        const kpis = await getKpis();
        res.json(kpis);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
