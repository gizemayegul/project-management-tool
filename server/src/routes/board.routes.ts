import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Boards from "../models/Boards.model";
import Columns from "../models/Columns.model";
const boardRoute = Router();
const fileUploader = require("../config/cloudinary.config");

boardRoute.post(
  "/:projectId/createboard",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    console.log(projectId, "MAMMMMMM");
    const { boardName } = req.body;
    const { _id: userId } = req.user;
    if (!boardName) {
      res.status(400).json({ message: "Please provide a board name" });
      return;
    }
    const findBoard = await Boards.findOne({
      projectId: projectId,
      boardName: boardName,
      userId: userId,
    });
    if (findBoard) {
      res.status(400).json({ message: "The board already exists" });
      return;
    }
    try {
      const createBoard = await Boards.create({
        projectId: projectId,
        boardName: boardName,
        userId: userId,
        projectName: req.body.projectName,
      });
      const defaultColumns = ["To Do", "In Progress", "Done"];
      for (const columnName of defaultColumns) {
        const column = await Columns.create({
          boardId: createBoard._id,
          columnName: columnName,
          tasks: [],
          index: defaultColumns.indexOf(columnName),
          projectId: projectId,
          projectName: createBoard.projectName,
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
    if (!req.user) {
      return res.status(400).json({ message: "User not found" });
    }
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

//!delete board

boardRoute.delete(
  "/boards/:boardId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse) => {
    const { boardId } = req.params;
    try {
      const response = await Boards.findByIdAndDelete(boardId);
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

//!!update board name
boardRoute.put(
  "/boards/:boardId/boardName",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse) => {
    const { boardId } = req.params;
    const { boardName } = req.body;

    try {
      const response = await Boards.findByIdAndUpdate(
        boardId,
        { boardName },
        { new: true }
      );

      res.json(response);
    } catch (error) {
      res.json(error);
    }
  }
);
boardRoute.put(
  "/boards/:boardId/favorite",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { boardId } = req.params;
    console.log(boardId);
    if (!boardId) {
      res.status(400).json({ message: "An unexpected error happened" });
      return;
    }
    try {
      // Find the board by ID first
      const board = await Boards.findById(boardId);
      if (!board) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      // Update the favorite field and return the updated document
      const updatedBoard = await Boards.findByIdAndUpdate(
        boardId,
        { favorite: !board.favorite },
        { new: true }
      );

      if (updatedBoard) {
        res.status(200).json(updatedBoard);
      } else {
        res.status(500).json({ message: "Failed to update the board" });
      }
    } catch (error) {
      console.error(
        "An error occurred while updating the board's favorite status:",
        error
      );
      res.status(500).json({
        message: "An error occurred while updating the board's favorite status",
      });
    }
  }
);

boardRoute.put(
  "/boards/:boardId/upload",
  isAuthenticated,
  fileUploader.single("imagebackground"),
  async (req: CustomRequest, res: CustomResponse) => {
    const { boardId } = req.params;
    console.log(req.file);
    if (!req.file) {
      res.status(400).json({ message: "Please provide an image" });
      return;
    }
    try {
      const updateImage = await Boards.findByIdAndUpdate(
        boardId,
        { imageUrl: req.file.path },
        { new: true }
      );
      res.status(200).json(updateImage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

boardRoute.get(
  "/boards/favorites",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse) => {
    const userId = req.user._id;
    try {
      const favoriteBoards = await Boards.find({
        userId: userId,
        favorite: true,
      });
      if (!favoriteBoards) {
        return res.status(404).json([]);
      }
      return res.status(200).json(favoriteBoards);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching favorites" });
    }
  }
);
export default boardRoute;
