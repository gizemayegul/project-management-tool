import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";

interface UserRequestBody {
  email: string;
  password: string;
  name: string;
  __v: number;
}
const userRoute = Router();
userRoute.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, name } = req.body as UserRequestBody;
    if (!email || !password || !name) {
      res
        .status(400)
        .json({ message: "Please provide email, password, and name" });
      return;
    }
    try {
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        res.status(409).json({
          message: "Email already exists. Please choose a different email.",
        });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      res.status(200).json({ message: "User created successfully" });

      const hashedPassword = await bcrypt.hash(password, salt);
      const createdUser = await User.create({
        email: email,
        password: hashedPassword,
        name: name,
      });

      const { password: _, ...userInfo } = createdUser.toObject();
    } catch (err) {
      res
        .status(500)
        .json({ message: "An error occurred while creating user" });
    }
  }
);

userRoute.post(
  "/login",
  async (req: Request, res: Response, NextFunction: NextFunction) => {
    const { email, password } = req.body as UserRequestBody;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }
    try {
      const findUser = await User.findOne({ email });
      if (!findUser) {
        res.status(400).json({ message: "User not found. Please sign up." });
      }
      const hashedPassword: any = findUser?.password;
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }
      const {
        password: _,
        __v,
        ...payload
      } = findUser?.toObject() as UserRequestBody;

      const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
        algorithm: "HS256",
        expiresIn: "3d",
      });
      res
        .status(201)
        .json({ token: token, message: "success", payload: payload });
    } catch (err) {
      console.error(err);
    }
  }
);

userRoute.get(
  "/verify",
  isAuthenticated,
  (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    res.json(req.user);
  }
);
export default userRoute;
