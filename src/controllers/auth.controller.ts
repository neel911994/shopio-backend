import { Request, Response } from 'express';
import { LoginService, RefreshTokenService } from '../services/auth.service';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await LoginService(email, password);
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken, user });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: 'No refresh token provided.' });
            return;
        }
        const { accessToken } = RefreshTokenService(refreshToken);
        res.json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: 'Invalid or expired refresh token. Please login again.' });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully.' });
};
