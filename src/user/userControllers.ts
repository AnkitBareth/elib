import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //Get the data from request

  const { name, email, password } = req.body;

  //Validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "Please enter all fields");
    return next(error);
  }
  //database call
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User already exists with this email");
    return next(error);
  }
  ///Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  //Process the request
  //Send the response

  res.json({ message: "User registered successfully" });
};

export { createUser };
