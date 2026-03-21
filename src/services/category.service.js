"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Get all categories
const getCategories = async () => {
    const categories = await prisma_1.default.category.findMany({
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
exports.getCategories = getCategories;
// Get single category by ID
const getCategoryById = async (id) => {
    const category = await prisma_1.default.category.findUnique({
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
exports.getCategoryById = getCategoryById;
// Create new category
const createCategory = async (name) => {
    const existingCategory = await prisma_1.default.category.findUnique({
        where: { name }
    });
    if (existingCategory) {
        throw new Error("Category already exists");
    }
    const category = await prisma_1.default.category.create({
        data: { name },
        select: {
            id: true,
            name: true
        }
    });
    return category;
};
exports.createCategory = createCategory;
