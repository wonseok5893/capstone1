import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

export const postLogin = async (req, res) => {
  if (!req.decoded) {
    const {
      body: { userId, userPassword },
    } = req;
    //SERCRET
    const secret = req.app.get("jwt-secret");
    const user = await User.findOne({ userId });
    if (user) {
      console.log(user);
      if (user.userId === userId && user.userPassword === userPassword) {
        //토큰 발급
        jwt.sign(
          {
            _id: user._id,
            userId: user.userId,
          },
          secret,
          {
            expiresIn: "7d", //만료기간
            issuer: "parkingReservation.herokuApp.com",
            subject: "userInfo",
          },
          (err, token) => {
            if (!err) {
              console.log("로그인 성공");
              res.json({
                result: "success",
                message: `${userId}로 로그인 성공`,
                token,
              });
            }
          }
        );
      } else {
        res.json({
          result: "fail",
          message: "로그인 실패. ID/PW를 확인해주세요",
        });
      }
    }
  } else {
    console.log(req.user);
    res.json({ result: "success", message: "자동 로그인 성공" });
  }
};

export const postJoin = async (req, res) => {
  console.log(req);
  const {
    body: { userId, userPassword, userName, userEmail, userPhone },
  } = req;
  try {
    const userIdCheck = await User.findOne({ userId });

    if (userIdCheck !== null) {
      res.json({ result: "fail", message: "이미 존재하는 ID가 있습니다." });
    } else {
      const user = await User({
        userId,
        userPassword,
        userName,
        userEmail,
        userPhone,
      });
      await User.create(user);
      res.json({ result: "success", message: "회원가입 성공" });
    }
  } catch (error) {
    console.log(error);
    res.json({ result: "fail", message: "DB 오류" });
  }
};
const getJoin = function (req, res) {
  res.send("회원가입 페이지입니다!");
};

const changePassword = async function (req, res) {
  console.log("비밀번호 변경 요청", req);
  const userId = req.decoded.userId;
  const {
    body: { userPassword: beforeUserPassword, newUserPassword },
  } = req;
  console.log(beforeUserPassword, newUserPassword);
  try {
    const user = await User.findOne({ userId });
    if (beforeUserPassword === user.userPassword) {
      user.userPassword = newUserPassword;
      user.save(function (err) {
        if (err) res.json({ result: "fail", message: "db 저장 실패" });
        else {
          res.json({
            result: "success",
            message: "비밀번호를 변경하였습니다.",
          });
        }
      });
    } else {
      res.json({ result: "fail", message: "이전 비밀번호를 확인해주세요." });
    }
  } catch (e) {
    res.json({ result: "fail", message: "해당하는 유저가 없습니다." });
    console.log(e);
  }
};
const changePhone = function (req, res) {};
const changeId = function (req, res) {};

userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);
userRouter.post("/editPassword", changePassword);

export default userRouter;
