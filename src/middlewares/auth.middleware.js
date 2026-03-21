"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
        return;
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Access denied. Not authenticated." });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.userId }
        });
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Access denied. Insufficient permissions." });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
