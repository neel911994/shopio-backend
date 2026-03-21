"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = exports.getProductStats = exports.updateProduct = exports.getProductById = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const stockFilterToWhere = (stockFilter) => {
    if (stockFilter === 'inStock')
        return { stock: { gte: 5 } };
    if (stockFilter === 'lowStock')
        return { stock: { gt: 0, lt: 5 } };
    if (stockFilter === 'outOfStock')
        return { stock: 0 };
    return {};
};
const getProducts = async (filters = {}) => {
    const { categoryId, stockFilter, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = {
        ...(categoryId && { categoryId }),
        ...stockFilterToWhere(stockFilter),
        ...(search && {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        })
    };
    const [products, total, categories] = await Promise.all([
        prisma_1.default.product.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                isActive: true,
                category: {
                    select: { name: true }
                },
                createdAt: true
            }
        }),
        prisma_1.default.product.count({ where }),
        prisma_1.default.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
    ]);
    return {
        products,
        categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    const product = await prisma_1.default.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            isActive: true,
            category: {
                select: {
                    name: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    });
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};
exports.getProductById = getProductById;
const updateProduct = async (id, data) => {
    const existingProduct = await prisma_1.default.product.findUnique({
        where: { id }
    });
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    const updatedProduct = await prisma_1.default.product.update({
        where: { id },
        data: {
            ...(data.stock !== undefined && { stock: data.stock }),
            ...(data.isActive !== undefined && { isActive: data.isActive })
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            isActive: true,
            category: {
                select: {
                    name: true
                }
            },
            updatedAt: true
        }
    });
    return updatedProduct;
};
exports.updateProduct = updateProduct;
const getProductStats = async () => {
    const [total, active, lowStock, outOfStock] = await Promise.all([
        prisma_1.default.product.count(),
        prisma_1.default.product.count({ where: { isActive: true } }),
        prisma_1.default.product.count({ where: { stock: { gt: 0, lt: 5 } } }),
        prisma_1.default.product.count({ where: { stock: 0 } })
    ]);
    return { total, active, lowStock, outOfStock };
};
exports.getProductStats = getProductStats;
const addProduct = async (name, description, price, stock, categoryId, isActive) => {
    const category = await prisma_1.default.category.findUnique({
        where: { id: categoryId }
    });
    if (!category) {
        throw new Error("Category not found");
    }
    const product = await prisma_1.default.product.create({
        data: {
            name,
            description,
            price,
            stock,
            categoryId,
            isActive
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            isActive: true,
            category: {
                select: {
                    name: true
                }
            },
            createdAt: true
        }
    });
    return product;
};
exports.addProduct = addProduct;
