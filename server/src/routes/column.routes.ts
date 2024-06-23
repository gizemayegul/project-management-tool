import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Boards from "../models/Boards.model";
import Columns from "../models/Columns.model";
const columnRoute = Router();

//!! i keep all columns in differnt database so boardId is needed
columnRoute.get(
  "/columns/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { boardId } = req.params;
    if (!boardId) {
      res.status(400).json({ message: "An expected error happened" });
      return;
    }
    try {
      const response = await Columns.find({ boardId })
        .sort({
          index: 1,
        })
        .populate("tasks");

      res.status(200).json(response);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);
//!! this route is for creating the a column, i didnt want to cause new column

columnRoute.post(
  "/columns",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    try {
      const response = await Columns.create(req.body);
      res.status(200).json(response);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);

//!! this route is for creating the tasks

columnRoute.post(
  "/columns/:columnId/createTask",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;

    try {
      const response = await Columns.findByIdAndUpdate(
        columnId,
        { $push: { tasks: req.body } },
        {
          new: true,
        }
      );
      if (!response) {
        res.status(400).json({ message: "An expected error happened" });
        return;
      }
      const createdTask = response.tasks[response.tasks.length - 1];

      res.status(200).json(createdTask);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);
//!! this route is for reordering the tasks

columnRoute.put(
  "/columns/:columnId/tasks/reorder",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;
    const { tasks } = req.body;

    try {
      const response = await Columns.findByIdAndUpdate(
        columnId,
        { $set: { tasks } },
        {
          new: true,
        }
      );
      res.status(200).json(response);
      console.log(response);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);

//!! this route is for Dragging a task over a column here we have sorting and
//!! latest changes from column, i send eveything to backend from the frontend
//!! to manipulate drag and drop

columnRoute.put(
  "/columns/tasks/updateColumns",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { updatedColumns } = req.body;

      const updatePromises = updatedColumns.map((column: any) => {
        return Columns.findByIdAndUpdate(column._id, column, { new: true });
      });

      const response = await Promise.all(updatePromises);

      res.status(200).json(response);
    } catch (error) {
      console.error({
        message: "An error occurred while updating the columns",
        error,
      });
      res.status(500).json({
        message: "Failed to update columns",
        error,
      });
    }
  }
);

export default columnRoute;
