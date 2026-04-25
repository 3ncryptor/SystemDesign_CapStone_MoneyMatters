import express from "express";
import { TransactionController } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", TransactionController.create);
router.get("/", TransactionController.getAll);
router.delete("/:id", TransactionController.delete);

export default router;
