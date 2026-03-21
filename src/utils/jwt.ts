import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: object): string => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object): string => {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined');
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): object | string => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): object | string => {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined');
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
