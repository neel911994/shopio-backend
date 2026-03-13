import prisma from "../utils/prisma";

export const getProducts = async () => {
    const products = await prisma.product.findMany({
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
    return products;
};

export const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
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

export const updateProduct = async (
    id: string,
    data: {
        stock?: number;
        isActive?: boolean;
    }
) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id }
    });

    if (!existingProduct) {
        throw new Error("Product not found");
    }

    const updatedProduct = await prisma.product.update({
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

export const addProduct = async (
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: string,
    isActive: boolean
) => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const product = await prisma.product.create({
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