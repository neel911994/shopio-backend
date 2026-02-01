import prisma from "../utils/prisma";

export const getCustomers = async () => {
    const customers = await prisma.customer.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true
        }
    });
    return customers;
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
