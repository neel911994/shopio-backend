"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kpi_controller_1 = require("../controllers/kpi.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/kpis - Get all KPIs
router.get("/", auth_middleware_1.authenticate, kpi_controller_1.listKpis);
exports.default = router;
