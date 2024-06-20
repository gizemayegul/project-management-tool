import Tasks from "../models/Tasks.model";
import { NextFunction, Router } from "express";
import { CustomRequest, CustomResponse } from "../types/ types";
import isAuthenticated from "../middleware/isAutenticated";
import Columns from "../models/Columns.model";

const taskRoute = Router();
interface UserRequestBody {
  boardId: string;
  taskName: string;
  taskPriority: string;
  index: number;
  columnId: string;
  columnName: string;
}

taskRoute.post(
  "/create/:columnId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;
    console.log(req.body);
    const { taskName, taskPriority, boardId, index, columnName } =
      req.body as UserRequestBody;
    try {
      const response = await Tasks.create({
        columnId,
        taskName,
        taskPriority,
        boardId,
        index,
        columnName,
      });
      console.log(response);
      if (response) {
        await Columns.findByIdAndUpdate(
          { _id: columnId },
          { $push: { tasks: response._id } },
          { new: true }
        );
      }
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

// taskRoute.get(
//   "/tasks/:columnId",
//   isAuthenticated,
//   async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
//     const { columnId } = req.params;
//     try {
//       const response = await Tasks.find({ columnId }).sort({ index: 1 });
//       res.json(response);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );
taskRoute.get(
  "/tasks/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { boardId } = req.params;
    console.log(boardId, "eminem");
    try {
      const response = await Tasks.find({ boardId }).sort({
        index: 1,
      });
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
      const { index } = req.body;

      console.log(taskId, "taslw");

      const response = await Tasks.findByIdAndUpdate(
        taskId,
        { index: index },
        {
          new: true,
        }
      );
      console.log(response, "updated");
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export default taskRoute;
