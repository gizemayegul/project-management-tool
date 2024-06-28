import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Projects from "../models/Projects.model";
import Boards from "../models/Boards.model";
import Columns from "../models/Columns.model";

const projectRoute = Router();
projectRoute.post(
  "/createproject",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectName } = req.body;
    const userId = req.user._id;

    if (!projectName) {
      res.status(400).json({ message: "Please provide a project name" });
      return;
    }
    try {
      const createProject = await Projects.create({
        projectName: projectName,
        userId: userId,
      });

      const { ...projectInfo } = createProject.toObject();
      res.status(200).json({
        success: true,
        message: "Project created successfully",
        projectInfo: projectInfo,
      });
    } catch (error) {
      if (error && (error as any).code === 11000) {
        res.status(400).json({ message: "The project already exists" });
        return;
      }
      res
        .status(500)
        .json({ message: "An error occurred while creating user" });
    }
  }
);

projectRoute.get(
  "/projects",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const userId = req.user._id;
    if (!userId) {
      res.status(400).json({ message: "An expected error happened" });
    }
    try {
      const findProjects = await Projects.find({ userId: userId });
      if (findProjects) {
        res.status(200).json({
          message: "succesfully fetched the projects",
          projects: findProjects,
        });
      }
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the projects user",
      });
    }
  }
);

projectRoute.get(
  "/projects/:projectId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    if (!projectId) {
      res.status(400).json({ message: "An expected error happened" });
      return;
    }
    try {
      const findProject = await Projects.find({ _id: projectId });
      res.status(200).json(findProject);
    } catch (error) {
      console.error({
        message: "An error occurred while fetching the projects user",
      });
    }
  }
);

//!! this route is deleting the project and its children
projectRoute.delete(
  "/projects/:projectId",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    if (!projectId) {
      res.status(400).json({ message: "An expected error happened" });
      return;
    }
    try {
      const deleteProject = await Projects.deleteOne({ _id: projectId });
      res.status(200).json({ message: "Project deleted successfully" });
      //!! deleting the boards of the project
      await Boards.deleteMany({ projectId: projectId });
      //!! deleting the columns of the project
      await Columns.deleteMany({ projectId: projectId });
    } catch (error) {
      console.error({
        message: "An error occurred while deleting the project",
      });
    }
  }
);
export default projectRoute;
