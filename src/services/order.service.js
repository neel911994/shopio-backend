"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStats = exports.updateOrderStatus = exports.getOrderById = exports.getOrders = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getOrders = async (filters = {}) => {
    const { status, customerName, startDate, endDate, page = 1, limit = 10 } = filters;
    const normalizedStatus = status?.toUpperCase();
    const skip = (page - 1) * limit;
    const where = {
        ...(normalizedStatus && { status: normalizedStatus }),
        ...(customerName && {
            customer: {
                name: { contains: customerName, mode: 'insensitive' }
            }
        }),
        ...((startDate || endDate) && {
            createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) })
            }
        })
    };
    const [orders, total] = await Promise.all([
        prisma_1.default.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        }),
        prisma_1.default.order.count({ where })
    ]);
    const data = orders.map(order => ({
        orderId: order.id,
        customerName: order.customer.name,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString().split('T')[0],
        products: order.items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.price,
            quantity: item.quantity
        }))
    }));
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
exports.getOrders = getOrders;
const getOrderById = async (id) => {
    const order = await prisma_1.default.order.findUnique({
        where: { id },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            items: {
                include: {
                    product: {
                        include: {
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!order) {
        throw new Error("Order not found");
    }
    console.log("orderby id raw", order);
    // Transform to desired response format
    return {
        orderId: order.id,
        status: order.status,
        customerId: order.customer.id,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString().split('T')[0],
        products: order.items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            productDesc: item.product.description,
            categoryName: item.product.category.name,
            price: item.price,
            quantity: item.quantity
        }))
    };
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (id, status) => {
    const existingOrder = await prisma_1.default.order.findUnique({
        where: { id }
    });
    if (!existingOrder) {
        throw new Error("Order not found");
    }
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status. Must be one of: " + validStatuses.join(", "));
    }
    const updatedOrder = await prisma_1.default.order.update({
        where: { id },
        data: { status: status },
        select: {
            id: true,
            status: true,
            totalAmount: true,
            customer: {
                select: {
                    name: true
                }
            },
            createdAt: true
        }
    });
    return updatedOrder;
};
exports.updateOrderStatus = updateOrderStatus;
const calcTrend = (current, previous) => {
    if (previous === 0)
        return { percentage: 0, direction: 'up' };
    const percentage = parseFloat((((current - previous) / previous) * 100).toFixed(1));
    return { percentage: Math.abs(percentage), direction: percentage >= 0 ? 'up' : 'down' };
};
const getOrderStats = async () => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const [totalOrders, pendingOrders, completedOrders, revenueData, lastMonthTotal, lastMonthPending, lastMonthCompleted, lastMonthRevenue] = await Promise.all([
        prisma_1.default.order.count(),
        prisma_1.default.order.count({ where: { status: 'PENDING' } }),
        prisma_1.default.order.count({ where: { status: 'DELIVERED' } }),
        prisma_1.default.order.aggregate({ _sum: { totalAmount: true } }),
        prisma_1.default.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
        prisma_1.default.order.count({ where: { status: 'PENDING', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
        prisma_1.default.order.count({ where: { status: 'DELIVERED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
        prisma_1.default.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } })
    ]);
    const thisMonthTotal = await prisma_1.default.order.count({ where: { createdAt: { gte: startOfThisMonth } } });
    const thisMonthPending = await prisma_1.default.order.count({ where: { status: 'PENDING', createdAt: { gte: startOfThisMonth } } });
    const thisMonthCompleted = await prisma_1.default.order.count({ where: { status: 'DELIVERED', createdAt: { gte: startOfThisMonth } } });
    const thisMonthRevenueData = await prisma_1.default.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: startOfThisMonth } } });
    const thisMonthRevenue = thisMonthRevenueData._sum.totalAmount || 0;
    const prevMonthRevenue = lastMonthRevenue._sum.totalAmount || 0;
    return {
        totalOrders: { value: totalOrders, trend: calcTrend(thisMonthTotal, lastMonthTotal) },
        pendingOrders: { value: pendingOrders, trend: calcTrend(thisMonthPending, lastMonthPending) },
        completedOrders: { value: completedOrders, trend: calcTrend(thisMonthCompleted, lastMonthCompleted) },
        revenue: { value: revenueData._sum.totalAmount || 0, trend: calcTrend(thisMonthRevenue, prevMonthRevenue) }
    };
};
exports.getOrderStats = getOrderStats;
