"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await (0, auth_service_1.LoginService)(email, password);
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken, user });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: 'No refresh token provided.' });
            return;
        }
        const { accessToken } = (0, auth_service_1.RefreshTokenService)(refreshToken);
        res.json({ accessToken });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token. Please login again.' });
    }
};
exports.refresh = refresh;
const logout = (_req, res) => {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully.' });
};
exports.logout = logout;
