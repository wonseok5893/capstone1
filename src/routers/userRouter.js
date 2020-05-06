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
    body: {
      userId,
      userPassword,
      userName,
      userEmail,
      userPhone,
      userCarNumber,
    },
  } = req;
  const user = User.findOne({ userId });
  if (user.userId) {
    res.json({ result: "fail", mmessage: "이미 존재하는 ID가 있습니다." });
  } else {
    try {
      const user = await User({
        userId,
        userPassword,
        userName,
        userEmail,
        userPhone,
        userCarNumber,
      });
      await User.create(user);
      res.json({ result: "success", message: "회원가입 성공" });
    } catch (error) {
      console.log(error);
      res.json({ result: "fail", message: "이미 존재하는 ID가 있습니다." });
    }
  }
};
const getJoin = function (req, res) {
  res.send("회원가입 페이지입니다!");
};
userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);

export default userRouter;
