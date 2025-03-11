import { Request, Response, NextFunction } from "express";

const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ message: "Book created" });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
};

export { createBook };
