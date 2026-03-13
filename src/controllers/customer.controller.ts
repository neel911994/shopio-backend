import { Request, Response } from "express";
import { getCustomers, getCustomerById, updateCustomerPhone } from "../services/customer.service";

export const listCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await getCustomers();
        res.json(customers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomer = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const customer = await getCustomerById(id);
        res.json(customer);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const editCustomerPhone = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { phone } = req.body;
        const customer = await updateCustomerPhone(id, phone);
        res.status(200).json(customer);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
