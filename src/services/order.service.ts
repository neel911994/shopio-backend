import prisma from "../utils/prisma";

interface OrderFilters {
    status?: string;
    customerName?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export const getOrders = async (filters: OrderFilters = {}) => {
    const { status, customerName, startDate, endDate, page = 1, limit = 10 } = filters;
    const normalizedStatus = status?.toUpperCase();
    const skip = (page - 1) * limit;

    const where = {
        ...(normalizedStatus && { status: normalizedStatus as any }),
        ...(customerName && {
            customer: {
                name: { contains: customerName, mode: 'insensitive' as const }
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
        prisma.order.findMany({
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
        prisma.order.count({ where })
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

export const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
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

export const updateOrderStatus = async (id: string, status: string) => {
    const existingOrder = await prisma.order.findUnique({
        where: { id }
    });

    if (!existingOrder) {
        throw new Error("Order not found");
    }

    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status. Must be one of: " + validStatuses.join(", "));
    }

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: status as any },
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
