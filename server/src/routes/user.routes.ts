import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User.model";

const userRoute = Router();
userRoute.post(
  "/user",
  (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;
    User.create({ email: email, password: password });
    res.json("success");
    console.log(email, password);
  }
);

export default userRoute;
