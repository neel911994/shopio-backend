import prisma from "../utils/prisma";
import { comparePassword } from "../utils/password";
import { generateToken, verifyToken } from "../utils/jwt";

export const LoginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    const token = generateToken({ userId: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}