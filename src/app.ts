import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import createHttpError from "http-errors";

const app = express();

// Routes
app.get("/", (req, res) => {
  throw createHttpError(404, "Resource not found");
  // This line won't be reached
  res.json({ message: "Welcome To my server" });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
