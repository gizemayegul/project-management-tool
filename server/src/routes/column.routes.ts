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
//!! reorder the columns
columnRoute.put("/columns/reorder", isAuthenticated, async (req, res) => {
  const { updatedColumns } = req.body;

  try {
    // Perform bulk update of column indices
    const bulkOperations = updatedColumns.map((column: any) => ({
      updateOne: {
        filter: { _id: column._id },
        update: { index: column.index },
      },
    }));
    await Columns.bulkWrite(bulkOperations);

    // Fetch and return all columns sorted by index
    const sortedColumns = await Columns.find().sort({ index: 1 });
    res.status(200).json(sortedColumns);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the columns" });
  }
});
//!! this route is for creating the tasks

columnRoute.post(
  "/columns/:columnId/createTask",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;
    const { taskName } = req.body;

    try {
      const response = await Columns.findByIdAndUpdate(
        columnId,
        { $push: { tasks: { taskName: taskName || "Untitled" } } },
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

//!! edit task information

columnRoute.put(
  "/columns/:columnId/editTask/:taskId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId, taskId } = req.params;
    const { taskName } = req.body;

    try {
      const response = await Columns.findOneAndUpdate(
        { _id: columnId, "tasks._id": taskId },
        { $set: { "tasks.$.taskName": taskName } },
        { new: true }
      );

      if (!response) {
        return res.status(404).json({ message: "Column or task not found" });
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

//!! this foute for deleting a task

columnRoute.delete(
  "/columns/:columnId/deleteTask/:taskId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId, taskId } = req.params;

    try {
      const response = await Columns.findByIdAndUpdate(
        { _id: columnId, "tasks._id": taskId },
        { $pull: { tasks: { _id: taskId } } },
        { new: true }
      );
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

//!!this route for deleting column

columnRoute.delete(
  "/columns/:columnId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;

    try {
      const response = await Columns.findByIdAndDelete(columnId);
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

//!! this route for editing column name

columnRoute.put(
  "/columns/:columnId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { columnId } = req.params;
    const { columnName } = req.body;
    try {
      const response = await Columns.findByIdAndUpdate(
        columnId,
        { columnName },
        { new: true }
      );
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);
