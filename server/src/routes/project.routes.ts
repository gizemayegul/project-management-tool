import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import User from "../models/User.model";
import Projects from "../models/Projects.model";

const projectRoute = Router();
projectRoute.post(
  "/createproject",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectName } = req.body;
    console.log(req.user, "projectroute");
    const userId = req.user._id;
    console.log(projectName);

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

export default projectRoute;
