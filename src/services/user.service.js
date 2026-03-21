"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const password_1 = require("../utils/password");
const prisma_1 = __importDefault(require("../utils/prisma"));
const getUsers = async () => {
    const users = await prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        }
    });
    return users;
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    const existingUer = await prisma_1.default.user.findUnique({
        where: {
            email: data.email
        }
    });
    if (existingUer) {
        throw new Error("User already exists!");
    }
    const hashedPassword = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        }
    });
    return user;
};
exports.createUser = createUser;
const deleteUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            id: data.id
        }
    });
    if (!existingUser) {
        throw new Error("No such user found!");
    }
    const deletedUser = await prisma_1.default.user.delete({
        where: {
            id: data.id
        }
    });
    return deletedUser;
};
exports.deleteUser = deleteUser;
