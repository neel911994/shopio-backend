"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listKpis = void 0;
const kpi_service_1 = require("../services/kpi.service");
const listKpis = async (req, res) => {
    try {
        const kpis = await (0, kpi_service_1.getKpis)();
        console.log(`KPI ${JSON.stringify(kpis)}`);
        res.json(kpis);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.listKpis = listKpis;
