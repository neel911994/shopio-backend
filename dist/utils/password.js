"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.comparePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const comparePassword = async (plainPassword, hashedPassword) => {
    return bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
const hashPassword = async (plainPassword) => {
    return bcryptjs_1.default.hash(plainPassword, 10);
};
exports.hashPassword = hashPassword;
