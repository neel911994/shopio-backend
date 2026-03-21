"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.addUser = exports.getUser = exports.listUsers = void 0;
const user_service_1 = require("../services/user.service");
const listUsers = async (req, res) => {
    try {
        const users = await (0, user_service_1.getUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.listUsers = listUsers;
const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await (0, user_service_1.getUserById)(id);
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getUser = getUser;
const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await (0, user_service_1.createUser)({ name, email, password, role });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.addUser = addUser;
const removeUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await (0, user_service_1.deleteUser)({ id });
        res.status(200).json({ message: "User deleted successfully", user: user_service_1.deleteUser });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.removeUser = removeUser;
