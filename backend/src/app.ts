import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import monthlyRoutes from "./routes/monthly.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

const defaultOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

// In production set CORS_ORIGIN to a comma-separated list of allowed origins,
// e.g. CORS_ORIGIN=https://moneymatters.example.com
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  }),
);

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
