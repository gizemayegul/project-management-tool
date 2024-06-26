import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Boards from "../models/Boards.model";
import Columns from "../models/Columns.model";
const boardRoute = Router();

boardRoute.post(
  "/:projectId/createboard",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    const { boardName } = req.body;
    const { _id: userId } = req.user;
    if (!boardName) {
      res.status(400).json({ message: "Please provide a board name" });
      return;
    }
    try {
      const createBoard = await Boards.create({
        projectId: projectId,
        boardName: boardName,
        userId: userId,
      });
      const defaultColumns = ["To Do", "In Progress", "Done"];
      for (const columnName of defaultColumns) {
        console.log(columnName);
        const column = await Columns.create({
          boardId: createBoard._id,
          columnName: columnName,
          tasks: [],
          index: defaultColumns.indexOf(columnName),
        });
        createBoard.columns.push(column._id);
      }
      await createBoard.save();
      const { ...boardInfo } = createBoard.toObject();

      res.status(200).json({
        success: true,
        message: "Board created successfully",
        boardInfo: boardInfo,
      });
    } catch (error) {
      if (error && (error as any).code === 11000) {
        res.status(400).json({ message: "The board already exists" });
        return;
      }
      res
        .status(500)
        .json({ message: "An error occurred while creating user" });
    }
  }
);

boardRoute.get(
  "/:projectId/boards",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    console.log(projectId);
    if (!projectId) {
      res.status(400).json({ message: "An expected error happened" });
      return;
    }
    try {
      const fetchBoards = await Boards.find({ projectId: projectId });
      res.status(200).json({ boards: fetchBoards });
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);
boardRoute.get(
  "/:projectId/boards/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId, boardId } = req.params;
    console.log(projectId);
    if (!projectId || !boardId) {
      res.status(400).json({ message: "An expected error happened" });
      return;
    }
    try {
      const fetchBoards = await Boards.find({
        projectId: projectId,
        _id: boardId,
      });
      res.status(200).json(fetchBoards);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);

boardRoute.put(
  "/boards/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse) => {
    const { boardId } = req.params;
    let { statusName } = req.body;

    try {
      const response = await Boards.findByIdAndUpdate(
        boardId,
        {
          $push: { boardInitialColumns: { statusName } },
        },
        { new: true }
      );

      res.json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

//!!get all boards from the specific users

boardRoute.get(
  "/boards",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse) => {
    console.log(req.user);
    const { _id } = req.user;

    try {
      const response = await Boards.find({ userId: _id });
      res.json(response);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({
        message: "An error occurred while fetching the boards user",
      });
    }
  }
);

export default boardRoute;
