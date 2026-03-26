"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/users - List all users (Admin only)
router.get("/", auth_middleware_1.authenticate, user_controller_1.listUsers);
// GET /api/users/:id - Get single user by ID (Admin only)
router.get("/:id", auth_middleware_1.authenticate, user_controller_1.getUser);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ADMIN"), user_controller_1.addUser);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("ADMIN"), user_controller_1.removeUser);
exports.default = router;
