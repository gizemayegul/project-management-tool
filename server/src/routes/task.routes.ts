import Tasks from "../models/Tasks.model";
import { NextFunction, Router } from "express";
import { CustomRequest, CustomResponse } from "../types/ types";
import isAuthenticated from "../middleware/isAutenticated";
import { ObjectId } from "mongodb";

const taskRoute = Router();
interface UserRequestBody {
  boardId: string;
  taskName: string;
  taskPriority: string;
  taskStatus: string;
  index: number;
}

taskRoute.post(
  "/create/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { boardId } = req.params;
    console.log(boardId);
    const { taskName, taskPriority, taskStatus, index } =
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

taskRoute.put(
  "/tasks/:taskId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const { taskId } = req.params;

      const { taskStatus } = req.body;
      // const response = await Tasks.findById(taskId);

      const response = await Tasks.findByIdAndUpdate(
        taskId,
        { taskStatus: new ObjectId(taskStatus) },
        { new: true }
      );
      console.log(response, "updated");
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export default taskRoute;
