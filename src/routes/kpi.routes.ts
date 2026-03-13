import { Router } from "express";
import { listKpis } from "../controllers/kpi.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/kpis - Get all KPIs
router.get("/", authenticate, listKpis);

export default router;
