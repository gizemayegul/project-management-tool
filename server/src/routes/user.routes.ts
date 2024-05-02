import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Projects from "../models/Projects.model";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types"; // Assuming the types are defined in a separate file called "types.ts"

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
      res.status(400).json("Please fill all fields");
    }
    try {
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        res.status(409).json("email already exists");
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const createdUser = await User.create({
        email: email,
        password: hashedPassword,
        name: name,
      });

      const { password: _, ...userInfo } = createdUser.toObject();
      res.json({ userInfo });
    } catch (err) {
      console.error(err, "an error occured while creating user");
      res.status(500).json("An error occurred while creating user");
    }
  }
);

userRoute.post(
  "/login",
  async (req: Request, res: Response, NextFunction: NextFunction) => {
    const { email, password } = req.body as UserRequestBody;
    if (!email || !password) {
      res.status(400).json("Please fill the all the fields");
      return;
    }
    try {
      const findUser = await User.findOne({ email });
      if (!findUser) {
        res.status(400).json("user is not found please sign up");
      }
      const hashedPassword: any = findUser?.password;
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        res.status(400).json("the informations are not correct");
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
