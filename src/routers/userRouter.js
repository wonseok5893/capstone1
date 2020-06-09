import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import SharedLocation from "../models/SharedLocation";
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

const myReservationList = async (req, res) => {
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    try {
      const reservations = await User.findOne({
        userId: req.decoded.userId,
      }).populate({
        path: "reservation",
        select: "startTime endTime carNumber location",
      });

      let locationInfo = {};
      let data = reservations.reservation;
      let locationData = [];
      for (let e of data) {
        let sharedlocation = await SharedLocation.findOne(
          {
            _id: e.location,
          },
          "location parkingInfo"
        );
        console.log();
        locationInfo.startTime = e.startTime;
        locationInfo.endTime = e.endTime;
        locationInfo.carNumber = e.carNumber;
        locationInfo.location = sharedlocation.location;
        locationInfo.parkingInfo = sharedlocation.parkingInfo;

        locationData.push(locationInfo);
        e.locationData = locationData;
        locationInfo = {};
      }
      res.json({ data: locationData });
    } catch (err) {
      console.log(err);
    }
  }
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
const getImage = async function (req, res) {
  const filePath = path.format({
    dir: "uploads/images",
    base: "1589740033670.jpg",
  });
  console.log(typeof filePath);
  // try {
  //   const sharedLocation = await ;
  // } catch (err) {
  //   console.log(err);
  // }
  fs.readFile(
    filePath, //파일 읽기
    function (err, data) {
      if (err) console.log(err);
      else {
        console.log(data);
        //http의 헤더정보를 클라이언트쪽으로 출력
        //image/jpg : jpg 이미지 파일을 전송한다
        //write 로 보낼 내용을 입력
        res.writeHead(200, { "Context-Type": "image/jpg" }); //보낼 헤더를 만듬
        res.write(data); //본문을 만들고
        res.end(); //클라이언트에게 응답을 전송한다
      }
    }
  );
};
const userCarEnroll = async function (req, res) {
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    const {
      body: { userCarNumber },
    } = req;
    try {
      const user = await User.findOne({ userId: req.decoded.userId });
      user.userCarNumber = userCarNumber;
      user.save(function (err) {
        if (err) res.json({ result: "fail", message: "db 저장 실패" });
        else {
          res.json({
            result: "success",
            message: "차량 등록이 되었습니다",
          });
        }
      });
    } catch (err) {
      res.json({ result: "fail", message: "db 오류" });
      console.log(err);
    }
  }
};

userRouter.post("/imageTest", getImage);
userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);
userRouter.post("/editPassword", changePassword);
userRouter.post("/myReservation", myReservationList);
userRouter.post("/carEnroll", userCarEnroll);

export default userRouter;
