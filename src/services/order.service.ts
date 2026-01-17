import prisma from "../utils/prisma";

export const getOrders = async () => {
    const orders = await prisma.order.findMany({
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
    });
    console.log("orders raw form", orders);
    // Transform to desired response format
    return orders.map(order => ({
        orderId: order.id,
        customerName: order.customer.name,
        status: order.status,
        totalAmount: order.totalAmount,
        products: order.items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.price,
            quantity: item.quantity
        }))
    }));
};

export const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true
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
        customerId: order.customer.id,
        customerName: order.customer.name,
        totalAmount: order.totalAmount,
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
