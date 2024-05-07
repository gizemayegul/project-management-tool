import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./db";
import middleWare from "./config";
import userRoute from "./routes/user.routes";
import router from "./routes/index.routes";
import errorHandler from "./error-handling";
import projectRoute from "./routes/project.routes";
import boardRoute from "./routes/board.routes";

const app: Application = express();
middleWare(app);

app.use("/api", userRoute);
app.use("/", router);
app.use("/projects", projectRoute);
app.use("/board", boardRoute);

errorHandler(app);

export default app;
