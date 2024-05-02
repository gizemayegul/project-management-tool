import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

interface CustomRequest extends Request {
  user: {
    isAuthenticated: boolean;
  };
}

export const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers["authorization"];
  if (!token) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (error, decoded) => {
    if (error) return res.status(401).json({ message: "Unauthorized" });
    req.user = { isAuthenticated: true };
    next();
  });
};

export default isAuthenticated;
