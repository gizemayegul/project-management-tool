import Tasks from "../models/Tasks.model";
import { NextFunction, Router } from "express";
import { CustomRequest, CustomResponse } from "../types/ types";
import isAuthenticated from "../middleware/isAutenticated";

const taskRoute = Router();

taskRoute.post(
  "/create",
  isAuthenticated,
  (req: CustomRequest, res: CustomResponse, next: NextFunction) => {}
);

export default taskRoute;
