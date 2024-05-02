import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { CustomRequest, CustomResponse } from "../types/ types"; // Assuming the types are defined in a separate file called "types.ts"

export const isAuthenticated = (
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
) => {
  const token: string | undefined = req.headers["authorization"];
  if (!token) {
    res.status(400).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (error, decoded) => {
    if (error) return res.status(401).json({ message: "Unauthorized" });
    req.user = { ...(decoded as object), isAuthenticated: true };
    next();
  });
};

export default isAuthenticated;
