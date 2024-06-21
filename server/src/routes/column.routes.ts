import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Boards from "../models/Boards.model";
import Columns from "../models/Columns.model";
const columnRoute = Router();

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
      const response = await Columns.find({ boardId: boardId })
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

columnRoute.post(
  "/columns/:boardId",
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

columnRoute.put(
  "/columns/:columnId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;
    const { index } = req.body;

    try {
      const response = await Columns.findByIdAndUpdate(
        columnId,
        { index: index },
        {
          new: true,
        }
      );
      res.status(200).json(response);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);
columnRoute.post(
  "/columns/:columnId/createTask",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;
    const { task } = req.body;

    try {
      const response = await Columns.findByIdAndUpdate(
        columnId,
        { $push: { tasks: task } },
        {
          new: true,
        }
      );
      res.status(200).json(response);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);
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

columnRoute.put(
  "/columns/:boardId/updateColumns",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { boardId } = req.params;
      const { updatedColumns } = req.body;
      console.log(updatedColumns, "selam");

      // // Update each column
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
