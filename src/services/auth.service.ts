import prisma from "../utils/prisma";
import { comparePassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const LoginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
};

export const RefreshTokenService = (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken) as { userId: string; email: string };
    const accessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email });
    return { accessToken };
};
