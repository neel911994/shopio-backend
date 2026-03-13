import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../utils/prisma";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token) as { userId: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
        return;
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: "Access denied. Not authenticated." });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Access denied. Insufficient permissions." });
            return;
        }

        next();
    };
};
