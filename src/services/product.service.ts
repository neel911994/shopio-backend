import prisma from "../utils/prisma";

type StockFilter = 'inStock' | 'lowStock' | 'outOfStock';

const stockFilterToWhere = (stockFilter?: StockFilter) => {
    if (stockFilter === 'inStock') return { stock: { gte: 5 } };
    if (stockFilter === 'lowStock') return { stock: { gt: 0, lt: 5 } };
    if (stockFilter === 'outOfStock') return { stock: 0 };
    return {};
};

export const getProducts = async (filters: { categoryId?: string; stockFilter?: StockFilter; search?: string; page?: number; limit?: number } = {}) => {
    const { categoryId, stockFilter, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = {
        ...(categoryId && { categoryId }),
        ...stockFilterToWhere(stockFilter),
        ...(search && {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } }
            ]
        })
    };

    const [products, total, categories] = await Promise.all([
        prisma.product.findMany({
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
        prisma.product.count({ where }),
        prisma.category.findMany({
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

export const getProductStats = async () => {
    const [total, active, lowStock, outOfStock] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { stock: { gt: 0, lt: 5 } } }),
        prisma.product.count({ where: { stock: 0 } })
    ]);

    return { total, active, lowStock, outOfStock };
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