"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerPhone = exports.getCustomerById = exports.getCustomers = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getCustomers = async (search, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } }
        ]
    } : undefined;
    const [customers, total] = await Promise.all([
        prisma_1.default.customer.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                _count: { select: { orders: true } }
            }
        }),
        prisma_1.default.customer.count({ where })
    ]);
    return {
        customers: customers.map(c => ({ ...c, totalOrders: c._count.orders, _count: undefined })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};
exports.getCustomers = getCustomers;
const getCustomerById = async (id) => {
    const customer = await prisma_1.default.customer.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            orders: {
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    createdAt: true
                }
            },
            createdAt: true
        }
    });
    if (!customer) {
        throw new Error("Customer not found");
    }
    return customer;
};
exports.getCustomerById = getCustomerById;
const updateCustomerPhone = async (id, phone) => {
    const existingCustomer = await prisma_1.default.customer.findUnique({
        where: { id }
    });
    if (!existingCustomer) {
        throw new Error("Customer not found");
    }
    const updatedCustomer = await prisma_1.default.customer.update({
        where: { id },
        data: { phone },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true
        }
    });
    return updatedCustomer;
};
exports.updateCustomerPhone = updateCustomerPhone;
