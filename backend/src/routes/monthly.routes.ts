import express from "express";
import { MonthlyController } from "../controllers/monthly.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", MonthlyController.setGoal);
router.post("/close", MonthlyController.closeMonth);

export default router;
