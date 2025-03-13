import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import createHttpError from "http-errors";
import cors from "cors";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontendDomain,
  })
);
app.use(express.json());
/* app.use(express.urlencoded({ extended: true })); */

// Routes
app.get("/", (req, res) => {
  throw createHttpError(404, "Resource not found");
  // This line won't be reached
  res.json({ message: "Welcome To my server" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
