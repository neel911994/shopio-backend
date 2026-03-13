import jwt from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(payload, JWT_SECRET);
}

export const verifyToken = (token: string): object | string => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.verify(token, JWT_SECRET);
}