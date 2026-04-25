import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import monthlyRoutes from "./routes/monthly.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/monthly-plan", monthlyRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

app.use(errorMiddleware);

export default app;
