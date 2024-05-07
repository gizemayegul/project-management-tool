import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Boards from "../models/Boards.model";
const boardRoute = Router();

boardRoute.post(
  "/:projectId/createboard",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    console.log(projectId);
    const { boardName } = req.body;
    if (!boardName) {
      res.status(400).json({ message: "Please provide a board name" });
      return;
    }
    try {
      const createBoard = await Boards.create({
        projectId: projectId,
        boardName: boardName,
      });
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

export default boardRoute;
