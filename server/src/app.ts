import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./db";
import middleWare from "./config";
import userRoute from "./routes/user.routes";
import router from "./routes/index.routes";
import errorHandler from "./error-handling";

const app: Application = express();
middleWare(app);

app.use("/api", userRoute);
app.use("/", router);
errorHandler(app);

export default app;
