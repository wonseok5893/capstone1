import express from "express";
import userRouter from "./userRouter";
import User from "../models/User";
import Image from "../models/Image";
import { uploadImage } from "../multerMiddleware";
import fs from "fs";
import path from "path";
const globalRouter = express.Router();

const getHome = function (req, res) {
  res.send("주차장 예약 시스템에 오신 것을 환영합니다!");
};
const getAllusers = async function (req, res) {
  try {
    console.log(req.decoded);
    const user = await User.findOne({ userId: req.decoded.userId });
    if (user.state != 1) {
      res.json({ result: "fail", message: "잘못된 접근 입니다." });
    } else {
      const allUser = await User.find();
      res.json({ result: "success", users: allUser });
    }
  } catch (err) {
    console.log(err);
    res.json({ result: "fail", message: "DB 오류" });
  }
};
const uploadTest = async (req, res) => {
  if (!req.decoded) {
    res.json({ result: "fail", message: "비정상적인 접근" });
    fs.unlink(
      path.join(__dirname, `../../uploads/images/${req.file.filename}`),
      (err) => {
        if (err) throw err;
        console.log(
          "잘못된 접근으로 만들어진",
          req.file.filename,
          "을 지웠습니다"
        );
      }
    );
  } else {
    if (!req.file) {
      res.json({ result: "fail", message: "파일 전송 요청 오류" });
    } else {
      console.log(req.file);
      const image = await Image({
        owner: req.decoded._id,
        fileName: req.file.filename,
        filePath: req.file.path,
      });
      try {
        await Image.create(image);
        res.json({
          result: "success",
          message: "성공적으로 이미지를 업로드 하였습니다.",
        });
      } catch (err) {
        console.log(err);
        res.json({ result: "fail", message: "DB 오류" });
      }
    }
  }
};
globalRouter.get("/", getHome);
globalRouter.get("/upload", (req, res) => {
  res.render("uploadTest");
});
globalRouter.post("/upload", uploadImage, uploadTest);
globalRouter.post("/admin/users", getAllusers);
export default globalRouter;
