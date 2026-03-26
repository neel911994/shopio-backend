"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.editProduct = exports.getProduct = exports.listProducts = exports.getStats = void 0;
const product_service_1 = require("../services/product.service");
const getStats = async (_req, res) => {
    try {
        const stats = await (0, product_service_1.getProductStats)();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getStats = getStats;
const listProducts = async (req, res) => {
    try {
        const { categoryId, stockFilter, search, page, limit } = req.query;
        const products = await (0, product_service_1.getProducts)({ categoryId, stockFilter, search, page: page ? parseInt(page) : undefined, limit: limit ? parseInt(limit) : undefined });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.listProducts = listProducts;
const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await (0, product_service_1.getProductById)(id);
        res.json(product);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getProduct = getProduct;
const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { stock, isActive } = req.body;
        const product = await (0, product_service_1.updateProduct)(id, { stock, isActive });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.editProduct = editProduct;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, isActive } = req.body;
        if (!name || !price || !stock || !categoryId) {
            return res.status(400).json({ message: "name, price, stock, and categoryId are required" });
        }
        const product = await (0, product_service_1.addProduct)(name, description, price, stock, categoryId, isActive ?? true);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
