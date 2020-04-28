import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import userRouter from "./routers/userRouter";

const app = express();

app.use(helmet());
app.set("/", path.join(__dirname, "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
