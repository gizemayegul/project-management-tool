import dotenv from "dotenv";
import path from "path";

// Determine which .env file to load based on the environment
let envFile = "";

if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV, "NODE_ENV");
  envFile = path.resolve(
    __dirname,
    `./.env.${process.env.NODE_ENV || "development"}`
  );
} else {
  envFile = path.resolve(`./.env.${process.env.NODE_ENV || "production"}`);
}

console.log(__dirname, "dirname");
console.log(envFile, "envFile");
console.log(process.env.NODE_ENV, "NODE_ENV");

// Load environment variables
dotenv.config({ path: envFile });

// Access the environment variables after loading them
const port = process.env.PORT || 5004;
const host = process.env.HOST || "0.0.0.0";

console.log(`Loaded environment variables from ${envFile}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`HOST: ${process.env.HOST}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

import "../src/db";
// import app from "../app";
import express, { Application } from "express";
import userRoute from "../src/routes/user.routes";
import errorHandler from "../src/error-handling/index";
import projectRoute from "../src/routes/project.routes";
import boardRoute from "../src/routes/board.routes";
import columnRoute from "../src/routes/column.routes";
import middleWare from "../src/config/index";

const app: Application = express();
middleWare(app);

app.use("/", userRoute);
app.use("/", projectRoute);
app.use("/", boardRoute);
app.use("/", columnRoute);

errorHandler(app);
export default app;

app.listen(Number(port), host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
