import express from "express";
import User from "../models/User";
import SharedLocation from "../models/SharedLocation";
import userRouter from "./userRouter";
import Reservation from "../models/Reservation";
import { uploadImage } from "../multerMiddleware";

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
    body: {
      userBirth,
      userCarNumber,
      location,
      latitude,
      longitude,
      parkingInfo,
    },
  } = req;
  if (!req.file) {
    res.json({
      result: "fail",
      message: "이미지 파일이 정상적으로 업로드 되지 않았습니다.",
    });
  } else {
    if (!req.decoded) {
      res.json({ result: "fail", message: "잘못된 접근입니다" });
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
      const user = await User.findOne({ userId: req.decoded.userId });
      console.log("TEST", user.sharingParkingLot);
      if (user.sharingParkingLot) {
        res.json({ result: "fail", message: "등록된 공유 주차장이 있습니다." });
      } else {
        try {
          const sharedLocation = await SharedLocation({
            owner: req.decoded._id,
            filePath: req.file.path,
            userCarNumber,
            userBirth,
            location,
            latitude,
            longitude,
            parkingInfo,
          });

          await SharedLocation.create(sharedLocation);
          console.log(sharedLocation);
          console.log("배정자 등록 신청이 완료 되었습니다.");
          res.json({
            result: "success",
            message: "배정자 등록 신청이 완료되었습니다.",
          });
        } catch (err) {
          console.log(err);
          res.json({ result: "fail", message: "배정자 등록 신청 실패" });
        }
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
apiRouter.post("/sharedLocation/enroll", uploadImage, sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/car");
apiRouter.get("/getLocation", getLocation);
apiRouter.get("/getAddress", getAddress);
apiRouter.get("/getLocation", getLocation);

export default apiRouter;
