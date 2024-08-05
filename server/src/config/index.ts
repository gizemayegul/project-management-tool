import express, { Application } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const FRONTEND_URL = process.env.CLIENT || "http://127.0.0.1:5006";
console.log(FRONTEND_URL, "FRONTEND_URL");
const HOST_URL = process.env.CLIENT_HOST || "http://127.0.0.1:5006";
console.log(HOST_URL, "HOST_URL");

const middleWare = (app: Application) => {
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: [FRONTEND_URL, HOST_URL],
      methods: ["GET", "POST"], // Only allow necessary methods
      allowedHeaders: ["Content-Type", "Authorization"], // Only allow necessary headers
      credentials: true,
      optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static("public"));
};

export default middleWare;
