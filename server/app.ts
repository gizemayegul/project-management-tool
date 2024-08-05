import express, { Application } from "express";
import userRoute from "./src/routes/user.routes";
import errorHandler from "./src/error-handling/index";
import projectRoute from "./src/routes/project.routes";
import boardRoute from "./src/routes/board.routes";
import columnRoute from "./src/routes/column.routes";
import middleWare from "./src/config/index";

const app: Application = express();
middleWare(app);

app.use("/", userRoute);
app.use("/", projectRoute);
app.use("/", boardRoute);
app.use("/", columnRoute);

errorHandler(app);
export default app;
