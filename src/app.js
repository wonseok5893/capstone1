import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import userRouter from "./routers/userRouter";
import dotenv from "dotenv";
import multerMiddleware from "./multerMiddleware";
import { jwtMiddleware } from "./jwtMiddleware";
import multer from "multer";
dotenv.config();

const app = express();

app.use(helmet());
app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("/", path.join(__dirname, "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.set("jwt-secret", process.env.SECRET);

app.use(jwtMiddleware);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
