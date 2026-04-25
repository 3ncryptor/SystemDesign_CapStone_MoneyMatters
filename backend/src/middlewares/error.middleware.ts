import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
