import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //Get the data from request

  const { name, email, password } = req.body;

  //Validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "Please enter all fields");
    return next(error);
  }
  //database call

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  ///Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  //token generation

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    //Send the response

    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  //get the data from request
  const { email, password } = req.body;

  //Validation
  if (!email || !password) {
    return next(createHttpError(400, "Please enter all fields"));
  }
  //handle errors
  //wrapping the database call in try catch block as todo: refactor this
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(createHttpError(404, "user not found"));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch)
    return next(createHttpError(400, "Username or password is incorrect"));

  // create access token

  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  res.json({ accessToken: token });
};

export { createUser, loginUser };
