"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
