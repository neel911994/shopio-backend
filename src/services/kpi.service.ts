import prisma from "../utils/prisma";

// Helper function to calculate percentage change and trend direction
const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, trend: 'neutral' as const };
    const change = ((current - previous) / previous) * 100;
    return {
        value: Number(change.toFixed(1)),
        trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const,
        previousValue: previous
    };
};

export const getKpis = async () => {
    // Define time periods for comparison
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // === TOTAL REVENUE (with trend) ===
    const currentRevenue = await prisma.order.aggregate({
        where: {
            status: { in: ['PAID', 'DELIVERED'] },
            createdAt: { gte: startOfCurrentMonth }
        },
        _sum: { totalAmount: true }
    });

    const lastMonthRevenue = await prisma.order.aggregate({
        where: {
            status: { in: ['PAID', 'DELIVERED'] },
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { totalAmount: true }
    });

    const totalRevenue = {
        current: currentRevenue._sum.totalAmount || 0,
        ...calculateTrend(
            currentRevenue._sum.totalAmount || 0,
            lastMonthRevenue._sum.totalAmount || 0
        )
    };

    // === TOTAL ORDERS (with trend) ===
    const currentOrderCount = await prisma.order.count({
        where: { createdAt: { gte: startOfCurrentMonth } }
    });

    const lastMonthOrderCount = await prisma.order.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
    });

    const totalOrder = {
        current: await prisma.order.count(),
        thisMonth: currentOrderCount,
        ...calculateTrend(currentOrderCount, lastMonthOrderCount)
    };

    // === SUCCESSFUL ORDERS (with trend) ===
    const currentSuccessful = await prisma.order.count({
        where: {
            status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
            createdAt: { gte: startOfCurrentMonth }
        }
    });

    const lastMonthSuccessful = await prisma.order.count({
        where: {
            status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
    });

    const SuccessfulOrder = {
        current: await prisma.order.count({
            where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }
        }),
        thisMonth: currentSuccessful,
        successRate: currentOrderCount > 0 ? Number(((currentSuccessful / currentOrderCount) * 100).toFixed(1)) : 0,
        ...calculateTrend(currentSuccessful, lastMonthSuccessful)
    };

    // === CANCELLED ORDERS (with trend) ===
    const currentCancelled = await prisma.order.count({
        where: {
            status: { in: ['CANCELLED'] },
            createdAt: { gte: startOfCurrentMonth }
        }
    });

    const lastMonthCancelled = await prisma.order.count({
        where: {
            status: { in: ['CANCELLED'] },
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
    });

    const cancelledOrder = {
        current: await prisma.order.count({
            where: { status: { in: ['CANCELLED'] } }
        }),
        thisMonth: currentCancelled,
        cancellationRate: currentOrderCount > 0 ? Number(((currentCancelled / currentOrderCount) * 100).toFixed(1)) : 0,
        ...calculateTrend(currentCancelled, lastMonthCancelled)
    };

    // === ORDER BY STATUS ===
    const orderByStatus = await prisma.order.groupBy({
        by: ['status'],
        _count: true
    });

    // === AVG ORDER VALUE (with trend) ===
    const currentAvgOrder = await prisma.order.aggregate({
        where: { createdAt: { gte: startOfCurrentMonth } },
        _avg: { totalAmount: true }
    });

    const lastMonthAvgOrder = await prisma.order.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _avg: { totalAmount: true }
    });

    const avgOrderValue = {
        current: currentAvgOrder._avg.totalAmount || 0,
        ...calculateTrend(
            currentAvgOrder._avg.totalAmount || 0,
            lastMonthAvgOrder._avg.totalAmount || 0
        )
    };

    // === LOW STOCK PRODUCTS ===
    const lowStockProduct = await prisma.product.findMany({
        where: {
            stock: { lt: 10 }
        },
        orderBy: {
            stock: 'asc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    const criticalStock = lowStockProduct.filter(p => p.stock <= 5).length;
    const warningStock = lowStockProduct.filter(p => p.stock > 5 && p.stock < 10).length;

    // === INVENTORY VALUE (with trend) ===
    const products = await prisma.product.findMany({
        select: {
            price: true,
            stock: true
        }
    });

    const currentInventoryValue = products.reduce((sum, product) => {
        return sum + (product.price * product.stock);
    }, 0);

    const totalProducts = await prisma.product.count();
    const newProductsThisMonth = await prisma.product.count({
        where: { createdAt: { gte: startOfCurrentMonth } }
    });

    const lastMonthProducts = await prisma.product.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
    });

    const inventoryValue = {
        current: currentInventoryValue,
        totalUnits: products.reduce((sum, p) => sum + p.stock, 0),
        totalProducts,
        newThisMonth: newProductsThisMonth,
        ...calculateTrend(newProductsThisMonth, lastMonthProducts)
    };

    // === TOP SELLING PRODUCTS ===
    const topSellingProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 5
    });

    const topProducts = await Promise.all(
        topSellingProducts.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: {
                    id: item.productId
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return {
                ...product,
                totalQuantitySold: item._sum.quantity
            };
        })
    );

    return {
        totalRevenue,
        totalOrder,
        SuccessfulOrder,
        cancelledOrder,
        orderByStatus,
        avgOrderValue,
        lowStockProduct: {
            products: lowStockProduct,
            total: lowStockProduct.length,
            critical: criticalStock,
            warning: warningStock
        },
        inventoryValue,
        topProducts
    };
};
