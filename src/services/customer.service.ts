import prisma from "../utils/prisma";

export const getCustomers = async (search?: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } }
        ]
    } : undefined;

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
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
        prisma.customer.count({ where })
    ]);

    return {
        customers: customers.map(c => ({ ...c, totalOrders: c._count.orders, _count: undefined })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};

export const getCustomerById = async (id: string) => {
    const customer = await prisma.customer.findUnique({
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

export const updateCustomerPhone = async (id: string, phone: string) => {
    const existingCustomer = await prisma.customer.findUnique({
        where: { id }
    });

    if (!existingCustomer) {
        throw new Error("Customer not found");
    }

    const updatedCustomer = await prisma.customer.update({
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
