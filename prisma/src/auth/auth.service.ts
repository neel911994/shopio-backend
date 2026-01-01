import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../utils/password.js";
import { generateToken,verifyToken} from "../utils/jwt.js";

const prisma = new PrismaClient();

export const LoginService = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { username }
    }); 
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    const token = generateToken({ userId: user.id, username: user.username });
    return { token, user: { id: user.id, username: user.username, role: user.role } };
}