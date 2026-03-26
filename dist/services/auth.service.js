"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = exports.LoginService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const LoginService = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('User not found');
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isPasswordValid)
        throw new Error('Invalid password');
    const payload = { userId: user.id, email: user.email };
    const accessToken = (0, jwt_1.generateAccessToken)(payload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
};
exports.LoginService = LoginService;
const RefreshTokenService = (refreshToken) => {
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: decoded.userId, email: decoded.email });
    return { accessToken };
};
exports.RefreshTokenService = RefreshTokenService;
