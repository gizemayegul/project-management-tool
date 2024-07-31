import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from "../middleware/isAutenticated";
import { CustomRequest, CustomResponse } from "../types/ types";
import Projects from "../models/Projects.model";
import Boards from "../models/Boards.model";
import Columns from "../models/Columns.model";
const fileUploader = require("../config/cloudinary.config");

const projectRoute = Router();
projectRoute.post(
  "/projects/createproject",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectName } = req.body;
    const userId = req.user._id;

    if (!projectName) {
      res.status(400).json({ message: "Please provide a project name" });
      return;
    }
    try {
      const response = await Projects.create({
        projectName: projectName,
        userId: userId,
      });

      res.status(200).json(response);
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

projectRoute.put(
  "/projects/:projectId/favorite",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const { projectId } = req.params;
    console.log(projectId);
    if (!projectId) {
      res.status(400).json({ message: "An expected error happened" });
      return;
    }
    try {
      const project = await Projects.findById(projectId);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      const updatedProject = await Projects.findByIdAndUpdate(
        projectId,
        { favorite: !project.favorite },
        { new: true }
      );
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.error({
        message: "An error occurred while updating the project",
      });
    }
  }
);

projectRoute.get(
  "/api/projects/favorites",
  isAuthenticated,
  async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    const userId = req.user._id;
    try {
      const projects = await Projects.find({
        userId: userId,
        favorite: true,
      });

      // if (!projects.length) {
      //   return res.status(404).json([]);
      // }

      return res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An internal server error occurred" });
    }
  }
);
projectRoute.put(
  "/projects/:productId/upload",
  isAuthenticated,
  fileUploader.single("imagebackground"),
  async (req: CustomRequest, res: CustomResponse) => {
    const { productId } = req.params;
    console.log(req.file, "hello");
    if (!req.file) {
      res.status(400).json({ message: "Please provide an image" });
      return;
    }
    try {
      const updateImage = await Projects.findByIdAndUpdate(
        productId,
        { imageUrl: req.file.path },
        { new: true }
      );
      res.status(200).json(updateImage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

projectRoute.put(
  "/projects/:projectId",
  async (req: CustomRequest, res: CustomResponse) => {
    try {
      const { projectId } = req.params;
      const { projectName } = req.body;
      const project = await Projects.findByIdAndUpdate(
        projectId,
        { projectName },
        { new: true }
      );
      res.status(200).json(project);
    } catch (error) {
      console.log(error);
    }
  }
);

export default projectRoute;
