import express from "express";
import User from "../models/User";
import SharedLocation from "../models/SharedLocation";
import userRouter from "./userRouter";
import Reservation from "../models/Reservation";

const apiRouter = express.Router();

// const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };
export const getUserInfo = async function (req, res) {
  if (!req.decoded) {
    res.json({
      result: "fail",
      message: "유저 정보를 가져오는데 실패 했습니다. 인증 오류",
    });
  } else {
    console.log(req.decoded);

    await User.findOne({ userId: req.decoded.userId })
      .select("userId userName userEmail userPhone userCarNumber point state")
      .populate({
        path: "sharingParkingLot",
        select: "latitude longitude state",
      })
      .exec((err, data) => {
        if (err) console.log(err);
        else {
          if (data) {
            console.log("토큰 인중 후 ", data);
            res.json({ result: "success", user: data });
          } else {
            res.json({
              result: "fail",
              message: "다시 로그인 해주세요",
            });
          }
        }
      });
  }
};

const sharedLocationEnroll = async (req, res) => {
  console.log("배정자 등록 요청", req);
  const {
    body: { latitude, longitude, price },
  } = req;
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다" });
  } else {
    const user = await User.findOne({ userId: req.decoded.userId });
    console.log("TEST", user.sharingParkingLot);
    if (user.sharingParkingLot) {
      res.json({ result: "fail", message: "등록된 공유 주차장이 있습니다." });
    } else {
      try {
        const sharedLocation = await SharedLocation({
          owner: req.decoded._id,
          latitude,
          longitude,
          price,
        });

        await SharedLocation.create(sharedLocation);
        console.log(sharedLocation);
        user.sharingParkingLot = sharedLocation._id;
        user.save(function (err) {
          if (err) res.json({ result: "fail", message: "db 저장 실패" });
          else {
            res.json({
              result: "success",
              message: "배정자 (임시) 등록에 성공하였습니다.", //관리자가 승인해주면 등록 안해주면 배정자 삭제 User parkingLot만 관리하면댐
            });
          }
        });
      } catch (err) {
        console.log(err);
        res.json({ result: "fail", message: "배정자 등록 실패" });
      }
    }
  }
};

const reservationEnroll = async (req, res) => {
  console.log("예약 등록 요청", req);

  const {
    body: { startTime, endTime, sum },
  } = req;
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    try {
      const reservation = await Reservation({ startTime, endTime, sum });
      await Reservation.create(reservation);
    } catch (err) {
      console.log(err);
      res.json({ result: "fail", message: "예약 DB ERROR" });
    }
    try {
      const user = await User.findOne({ userId: req.decoded.userId });
      user.reservation.push(reservation);
      user.save((err) => {
        if (err) {
          console.log(err);
          res.json({ result: "fail", message: "사용자 예약 등록 실패" });
        } else {
          console.log(reservation);
          res.json({ result: "success", message: "사용자 예약 등록 완료" });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({ result: "fail", message: "사용자 등록 DB ERROR" });
    }
  }
};

const timeParse = (time) => {
  console.log(time);
};
const getLocation = async (req, res) => {
  console.log(req);
  var apiURL = "https://openapi.naver.com/v1/map/geocode?query=" + req.query;
  console.log(apiURL);
};
const getAddress = (req, res) => {
  console.log(req);
  res.render("getAddress");
};
apiRouter.post("/auth", getUserInfo);
apiRouter.post("/sharedLocation/enroll", sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/car");
apiRouter.get("/getLocation", getLocation);
apiRouter.get("/getAddress", getAddress);

export default apiRouter;
