import express from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", DashboardController.getDashboard);

export default router;
