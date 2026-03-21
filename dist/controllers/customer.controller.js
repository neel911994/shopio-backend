"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCustomerPhone = exports.getCustomer = exports.listCustomers = void 0;
const customer_service_1 = require("../services/customer.service");
const listCustomers = async (req, res) => {
    try {
        const { search, page, limit } = req.query;
        const customers = await (0, customer_service_1.getCustomers)(search, page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.listCustomers = listCustomers;
const getCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await (0, customer_service_1.getCustomerById)(id);
        res.json(customer);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getCustomer = getCustomer;
const editCustomerPhone = async (req, res) => {
    try {
        const id = req.params.id;
        const { phone } = req.body;
        const customer = await (0, customer_service_1.updateCustomerPhone)(id, phone);
        res.status(200).json(customer);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.editCustomerPhone = editCustomerPhone;
