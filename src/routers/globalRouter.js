import express from "express";
import userRouter from "./userRouter";
import User from "../models/User";
import SharedLocation from "../models/SharedLocation";
import Image from "../models/Image";
import { uploadImage } from "../multerMiddleware";
import fs, { readSync } from "fs";
import Notice from "../models/Notice";
import path from "path";
import { isError } from "util";
import e from "express";
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
      res.json({ result: "fail", message: "이미지 오류" });
    } else {
      console.log(req);
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
const checkSharedLocation = async (req, res) => {
  const admin = await User.findOne({ userId: req.decoded.userId });
  if (admin.state != 1) {
    res.json({ registerLocationResult: "fail", message: "잘못된 접근입니다." });
  } else {
    const {
      body: { _id, userId },
    } = req;
    console.log(req);
    const owner = await User.findOne({ userId });
    if (owner.sharingParkingLot) {
      res.json({ result: "failt", message: "등록된 주차장이 있습니다." });
    } else {
      owner.sharingParkingLot = _id;
      owner.save(function (err) {
        if (err)
          res.json({
            registerLocationResult: "fail",
            message: "배정자 등록 실패",
          });
      });
      const location = await SharedLocation.findOne({ _id });
      location.state = 1;
      location.save(function (err) {
        if (err)
          res.json({ registerLocationResult: "fail", message: "db 저장 실패" });
        else {
          res.json({
            registerLocationResult: "success",
            message: "배정자 등록 완료",
          });
        }
      });
    }
  }
};
const unCheckedSharedLocation = async (req, res) => {
  const admin = await User.findOne({ userId: req.decoded.userId });
  if (admin.state != 1) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    const unCheckedList = await SharedLocation.find({ state: 0 })
      .select(
        "userCarNumber userBirth location latitude longitude filePath parkingInfo enrollTime state"
      )
      .populate({
        path: "owner",
        select: "userId userName userPhone userCarNumber",
      });
    res.json({ data: unCheckedList });
    console.log(unCheckedList);
  }
};

const adminEditPassword = async (req, res) => {
  console.log(req);
  const {
    body: { editPassword, userId },
  } = req;
  //관리자 검증
  const user = await User.findOne({ userId: req.decoded.userId });
  console.log(user);
  if (user.state != 1) {
    res.json({ editPasswordResult: "fail", message: "잘못된 접근입니다" });
  } else {
    const clickedUser = await User.findOne({ userId });
    clickedUser.userPassword = editPassword;
    await clickedUser.save(function (err) {
      if (err)
        res.json({ editPasswordResult: "fail", message: "db 저장 실패" });
      else {
        res.json({
          editPasswordResult: "success",
          message: "관리자가 비밀번호 변경 성공",
        });
      }
    });
  }
};
const allNotice = async (req, res) => {
  console.log(req);
  const user = await User.findOne({ userId: req.decoded.userId });
  if (user.state != 1) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    const notices = await Notice.find();
    res.json({ result: "success", data: notices });
  }
};

const adminEditState = async (req, res) => {
  console.log(req);
  const {
    body: { editState, userId },
  } = req;
  //관리자 검증
  const user = await User.findOne({ userId: req.decoded.userId });
  console.log(user);
  if (user.state != 1) {
    res.json({ editStateResult: "fail", message: "잘못된 접근입니다" });
  } else {
    const clickedUser = await User.findOne({ userId });
    clickedUser.state = editState;
    await clickedUser.save(function (err) {
      if (err) res.json({ editStateResult: "fail", message: "db 저장 실패" });
      else {
        console.log(clickedUser);
        res.json({
          editStateResult: "success",
          message: "관리자가 권한 변경 성공",
        });
      }
    });
  }
};
const adminEditPhone = async (req, res) => {
  console.log(req);
  const {
    body: { editPhone, userId },
  } = req;
  //관리자 검증
  const user = await User.findOne({ userId: req.decoded.userId });
  console.log(user);
  if (user.state != 1) {
    res.json({ editPhoneResult: "fail", message: "잘못된 접근입니다" });
  } else {
    const clickedUser = await User.findOne({ userId });
    clickedUser.userPhone = editPhone;
    await clickedUser.save(function (err) {
      if (err) res.json({ editPhoneResult: "fail", message: "db 저장 실패" });
      else {
        console.log(clickedUser);
        res.json({
          editPhoneResult: "success",
          message: "관리자가 핸드폰 정보 성공",
        });
      }
    });
  }
};
const adminEditPoint = async (req, res) => {
  console.log(req);
  const {
    body: { editPoint, userId },
  } = req;
  //관리자 검증
  const user = await User.findOne({ userId: req.decoded.userId });
  console.log(user);
  if (user.state != 1) {
    res.json({ editPointResult: "fail", message: "잘못된 접근입니다" });
  } else {
    try {
      const clickedUser = await User.findOne({ userId });
      clickedUser.point = editPoint;
      console.log(clickedUser);
      clickedUser.save(function (err) {
        if (err) {
          console.log(err);
          res.json({ editPointResult: "fail", message: "db 저장 실패" });
        } else {
          console.log(clickedUser);
          res.json({
            editPointResult: "success",
            message: "관리자가 포인트 추가/감소",
          });
        }
      });
    } catch (err) {
      res.json({ result: "fail", message: "db 에러" });
    }
  }
};

globalRouter.get("/", getHome);
globalRouter.get("/upload", (req, res) => {
  res.render("uploadTest");
});
globalRouter.post("/upload", uploadImage, uploadTest);
globalRouter.post("/admin/users", getAllusers);
globalRouter.post("/admin/allNotice", allNotice);
globalRouter.post("/admin/sharedLocation/enroll", checkSharedLocation);
globalRouter.post("/admin/unCheckedList", unCheckedSharedLocation);
globalRouter.post("/admin/editPassword", adminEditPassword);
globalRouter.post("/admin/editPhone", adminEditPhone);
globalRouter.post("/admin/editPoint", adminEditPoint);
globalRouter.post("/admin/editState", adminEditState);

export default globalRouter;
