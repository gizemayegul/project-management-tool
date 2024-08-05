import express, { Application } from "express";
import userRoute from "./routes/user.routes";
import errorHandler from "./error-handling";
import projectRoute from "./routes/project.routes";
import boardRoute from "./routes/board.routes";
import columnRoute from "./routes/column.routes";
import middleWare from "./config";

const app: Application = express();
middleWare(app);

app.use("/", userRoute);
app.use("/", projectRoute);
app.use("/", boardRoute);
app.use("/", columnRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

errorHandler(app);
export default app;
