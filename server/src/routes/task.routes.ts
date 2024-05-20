import Tasks from "../models/Tasks.model";
import { NextFunction, Router } from "express";
import { CustomRequest, CustomResponse } from "../types/ types";
import isAuthenticated from "../middleware/isAutenticated";

const taskRoute = Router();
interface UserRequestBody {
  boardId: string;
  taskName: string;
  taskPriority: string;
  taskStatus: string;
}

taskRoute.post(
  "/create",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { boardId, taskName, taskPriority, taskStatus } =
      req.body as UserRequestBody;
    try {
      const response = await Tasks.create({
        boardId,
        taskName,
        taskPriority,
        taskStatus,
      });
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

taskRoute.get(
  "/tasks/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { boardId } = req.params;
    try {
      const response = await Tasks.find({ boardId });
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export default taskRoute;
