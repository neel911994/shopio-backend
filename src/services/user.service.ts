import { da } from "@faker-js/faker/.";
import { hashPassword } from "../utils/password";
import prisma from "../utils/prisma";

export const getUsers = async () => {
    const users = await prisma.user.findMany({
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

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
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

export const createUser = async(data: {
    name: string,
    email: string,
    password: string,
    role: string
})=>{
    const existingUer = await prisma.user.findUnique({
        where:{
            email: data.email
        }
    })
    if(existingUer){
        throw new Error("User already exists!");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data:{
            name:data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role as any
        },
        select:{
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        }
    })
    return user;
}

export const deleteUser = async(data:{
    id:string
})=>{
    const existingUser = await prisma.user.findUnique({
        where:{
            id: data.id
        }
    })
    if(!existingUser){
        throw new Error("No such user found!");
    }

    const deletedUser = await prisma.user.delete({
        where:{
            id: data.id
        }
    })

    return deletedUser;
}
