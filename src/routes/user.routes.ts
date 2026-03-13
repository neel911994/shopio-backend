import { Router } from "express";
import { listUsers, getUser, addUser, removeUser } from "../controllers/user.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/users - List all users (Admin only)
router.get("/", authenticate, listUsers);

// GET /api/users/:id - Get single user by ID (Admin only)
router.get("/:id", authenticate, getUser);

router.post("/",authenticate, authorizeRoles("ADMIN"), addUser);

router.delete("/:id", authenticate, authorizeRoles("ADMIN"), removeUser);


export default router;
