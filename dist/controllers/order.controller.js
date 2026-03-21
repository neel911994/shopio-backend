"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editOrderStatus = exports.getStats = exports.getOrder = exports.listOrders = void 0;
const order_service_1 = require("../services/order.service");
const listOrders = async (req, res) => {
    try {
        const { status, customerName, startDate, endDate, page, limit } = req.query;
        const orders = await (0, order_service_1.getOrders)({
            status: status,
            customerName: customerName,
            startDate: startDate,
            endDate: endDate,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.listOrders = listOrders;
const getOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await (0, order_service_1.getOrderById)(id);
        res.json(order);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getOrder = getOrder;
const getStats = async (_req, res) => {
    try {
        const stats = await (0, order_service_1.getOrderStats)();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getStats = getStats;
const editOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const order = await (0, order_service_1.updateOrderStatus)(id, status);
        res.status(200).json(order);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.editOrderStatus = editOrderStatus;
