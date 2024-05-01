import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Projects from "../models/Projects.model";

interface UserRequestBody {
  email: string;
  password: string;
  name: string;
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

userRoute;

export default userRoute;
