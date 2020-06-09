import express from "express";
import User from "../models/User";
import SharedLocation from "../models/SharedLocation";
import userRouter from "./userRouter";
import Reservation from "../models/Reservation";
import { uploadImage } from "../multerMiddleware";
import moment from "moment";
import "moment-timezone";
import e from "express";
moment.tz.setDefault("Asia/Seoul");

const apiRouter = express.Router();

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
            // possibleStartTime: "",
            // possibleEndTime: "",
            timeState: [0, 0, 0, 0, 0, 0, 0],
          });

          await SharedLocation.create(sharedLocation);
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
    body: { _id, carNumber, startTime, endTime },
  } = req;

  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    try {
      const reservation = await Reservation({
        client: req.decoded._id,
        location: _id,
        carNumber,
        startTime,
        endTime,
      });
      const createdReservation = await Reservation.create(reservation);

      const user = await User.findOne({ userId: req.decoded.userId });
      user.reservation.push(reservation);
      user.save((err) => {
        if (err) {
          console.log(err);
          res.json({ result: "fail", message: "사용자 예약 등록 실패" });
        }
      });
      const sharedLocation = await SharedLocation.findOne({ _id });
      createdReservation.owner = sharedLocation.owner;
      createdReservation.save((err) => {
        if (err) {
          res.json({ result: "fail", message: "예약에 소유자 등록 실패" });
        }
      });
      sharedLocation.reservationList.push(createdReservation._id);
      sharedLocation.save((err) => {
        if (err)
          res.json({ result: "fail", message: "배정지 예약 리스트 등록 실패" });
      });
      res.json({ result: "success", message: "예약 완료 되었습니다." });
    } catch (err) {
      console.log(err);
      res.json({ result: "fail", message: "사용자 등록 DB ERROR" });
    }
  }
};

const allSharedLocation = async (req, res) => {
  console.log(`모든 마커 정보 송신->${req.headers}`);
  console.log(req.headers["x-forwarded-for"], req.connection.remoteAddress);
  try {
    const allSharedLocations = await SharedLocation.find({ state: 1 })
      .select("location latitude longitude parkingInfo")
      .populate({
        path: "owner",
        select: "userId userPhone",
      });

    res.json({ result: "success", data: allSharedLocations });
  } catch (err) {
    res.json({ result: "fail", message: "db 에러" });
  }
};
const getAddress = (req, res) => {
  console.log(req);
  res.render("getAddress");
};
const sharedLocationReserveList = async (req, res) => {
  console.log(req);
  const {
    query: { locationId },
  } = req;

  const reserveList = await SharedLocation.findOne({
    _id: locationId,
  })
    .select("reservationList")
    .populate({ path: "reservationList", select: "startTime endTime" });

  let data = reserveList.reservationList.filter(function (e) {
    return +e.startTime.slice(8, 10) < +moment().format("DD") + 2;
  });

  res.json({ reservationList: data });
};
const shareInfo = async function (req, res) {
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    try {
      const user = await User.findOne({ userId: req.decoded.userId }).populate({
        path: "sharingParkingLot",
        select: "timeState possibleStartTime possibleEndTime",
      });

      if (!user.sharingParkingLot) {
        res.json({ result: "fail", message: "주차장을 먼저 공유하세요." });
      } else {
        res.json({
          result: "success",
          message: "공유 시간 정보 확인",
          startTime: user.sharingParkingLot.possibleStartTime,
          endTime: user.sharingParkingLot.possibleEndTime,
          Sun: user.sharingParkingLot.timeState[0],
          Mon: user.sharingParkingLot.timeState[1],
          Tue: user.sharingParkingLot.timeState[2],
          Wed: user.sharingParkingLot.timeState[3],
          Thu: user.sharingParkingLot.timeState[4],
          Fri: user.sharingParkingLot.timeState[5],
          Sat: user.sharingParkingLot.timeState[6],
        });
      }
    } catch (err) {
      res.json({ result: "fail", message: "db 오류" });
      console.log(err);
    }
  }
};
const updateShareInfo = async function (req, res) {
  console.log(req);
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    const {
      body: { startTime, endTime, days },
    } = req;

    try {
      const user = await User.findOne({ userId: req.decoded.userId });
      const sharedLocationID = user.sharingParkingLot;
      if (!user.sharingParkingLot) {
        res.json({ result: "fail", message: "주차장을 먼저 공유하세요." });
      } else {
        const sharedLocation = await SharedLocation.findOne({
          _id: sharedLocationID,
        });
        sharedLocation.possibleEndTime = endTime;
        sharedLocation.possibleStartTime = startTime;
        sharedLocation.timeState = JSON.parse(days);
        sharedLocation.save((err) => {
          if (err)
            res.json({
              result: "fail",
              message: "공유시간 수정 실패",
            });
          else res.json({ result: "success", message: "공유시간 수정 성공" });
        });
      }
    } catch (e) {
      console.log(e);
      res.json({ result: "fail", message: "db 오류" });
    }
  }
};
const sharingSwitch = async function (req, res) {
  const {
    body: { turn },
  } = req;
  if (!req.decoded) {
    res.json({ result: "fail", message: "잘못된 접근입니다." });
  } else {
    try {
      const user = await User.findOne({ userId: req.decoded.userId }).populate({
        path: "sharingParkingLot",
        select: "timeState ",
      });
      if (!user.sharingParkingLot) {
        res.json({ result: "fail", message: "주차장을 먼저 공유하세요." });
      } else {
        if (turn == 1)
          user.sharingParkingLot.timeState[new Date().getDay()] = 1;
        else if (turn == 0)
          user.sharingParkingLot.timeState[new Date().getDay()] = 0;
        user.save((err) => {
          if (err)
            res.json({
              result: "fail",
              message: "공유 중지 / 시작",
            });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

apiRouter.post("/auth", getUserInfo);
apiRouter.post("/sharedLocation/enroll", uploadImage, sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/allSharedLocation", allSharedLocation);
apiRouter.get("/reserveList", sharedLocationReserveList);
apiRouter.get("/getAddress", getAddress);
apiRouter.post("/shareInfo", shareInfo);
apiRouter.post("/sharingSwitch", sharingSwitch);
apiRouter.post("/sendShareInfo", updateShareInfo);

export default apiRouter;
