import { Request, Response } from "express";
import { isAuthenticated } from "../middleware/isAutenticated";

export interface CustomRequest extends Request {
  user?: any;
}
export interface CustomResponse extends Response {
  user?: any;
}
