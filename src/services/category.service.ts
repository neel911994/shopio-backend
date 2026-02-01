import prisma from "../utils/prisma";

// Get all categories
export const getCategories = async () => {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    products: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
    return categories;
};

// Get single category by ID
export const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    stock: true,
                    isActive: true
                }
            }
        }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    return category;
};

// Create new category
export const createCategory = async (name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name }
    });

    if (existingCategory) {
        throw new Error("Category already exists");
    }

    const category = await prisma.category.create({
        data: { name },
        select: {
            id: true,
            name: true
        }
    });

    return category;
};
