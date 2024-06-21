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
columnRoute.put("/columns/update", isAuthenticated, async (req, res) => {
  const { columns } = req.body;

  try {
    // Loop through each column and update it in the database
    for (const columnData of columns) {
      await Columns.findByIdAndUpdate(columnData._id, columnData, {
        new: true,
      });
    }

    res.status(200).json({ message: "Columns updated successfully" });
  } catch (error) {
    console.error("Error updating columns:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating columns" });
  }
});

export default columnRoute;
