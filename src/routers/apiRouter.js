import express from "express";
import User from "../models/User";
import SharedLocation from "../models/SharedLocation";
import userRouter from "./userRouter";
import Reservation from "../models/Reservation";
import { uploadImage } from "../multerMiddleware";
import moment from "moment";
import "moment-timezone";
import fs from "fs";
import path from "path";
import {
  changeMonth,
  changeDay,
  possibleTimeCheck,
} from "../controllers/dateController";
import e from "express";

const apiRouter = express.Router();

export const getUserInfo = async function (req, res) {
  if (!req.decoded) {
    res.json({
      result: "fail",
      message: "유저 정보를 가져오는데 실패 했습니다. 인증 오류",
    });
  } else {
    try {
      const checkUser = await User.findOne({ userId: req.decoded.userId });
      if (checkUser != null) {
        if (checkUser.sharingParkingLot != null) {
          const user = await User.findOne({ userId: req.decoded.userId })
            .select(
              "userId userName userEmail userPhone userCarNumber point state"
            )
            .populate({
              path: "sharingParkingLot",
              select: "latitude longitude state timeState",
            });

          const todaySharingState = await user.sharingParkingLot.timeState[
            changeDay(moment().format("ddd"))
          ];

          res.json({ result: "success", user, todaySharingState });
        } else {
          try {
            const user = await User.findOne({
              userId: req.decoded.userId,
            }).select(
              "userId userName userEmail userPhone userCarNumber point state"
            );
            res.json({ result: "success", user });
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        res.json({ result: "fail", message: "db에서 지워진 사용자입니다" });
      }
    } catch (err) {
      console.log(err);
      res.status(403).json({ result: "fail", message: "db 오류" });
    }
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
      description,
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
            timeState: [0, 0, 0, 0, 0, 0, 0],
            description,
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
  console.log(req);
  const {
    body: { _id, carNumber, startTime, endTime, point, sum },
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
        sum,
      });
      const user = await User.findOne({ userId: req.decoded.userId });
      const sharedLocation = await SharedLocation.findOne({ _id }).populate({
        path: "reservationList",
        select: "startTime endTime",
      });
      let moneyResult = true;
      let sharedResult = true;

      let result = true;
      if (user.point < +point) moneyResult = false;

      if (
        sharedLocation.timeState[changeDay(startTime.slice(0, 3))] == 0 ||
        sharedLocation.timeState[changeDay(endTime.slice(0, 3))] == 0
      )
        sharedResult = false;

      for (var e of sharedLocation.reservationList) {
        console.log(e, "결과" + result);
        if (
          new Date(e.startTime).getTime() <
            new Date(reservation.endTime).getTime() &&
          new Date(reservation.endTime).getTime() <
            new Date(e.endTime).getTime()
        )
          result = false;
        else if (
          new Date(e.startTime).getTime() <
            new Date(reservation.startTime).getTime() &&
          new Date(reservation.startTime).getTime() <
            new Date(e.endTime).getTime()
        )
          result = false;
      }

      if (sharedResult == false) {
        res.json({
          result: "fail",
          message: "해당 주차장은 오늘 공유가 종료되었습니다.",
        });
      } else {
        if (moneyResult == false) {
          res.json({ result: "fail", message: "포인트가 부족합니다." });
        } else {
          if (
            possibleTimeCheck(
              sharedLocation.possibleStartTime,
              sharedLocation.possibleEndTime,
              reservation.startTime,
              reservation.endTime
            ) == false
          )
            res.json({ result: "fail", message: "가능한 시간대가 아닙니다." });
          else {
            if (result == false) {
              res.json({
                result: "fail",
                message: "해당 시간은 예약이 되어 있습니다.",
              });
            } else {
              const createdReservation = await Reservation.create(reservation);
              user.point -= +point;
              user.reservation.push(createdReservation._id);
              user.save((err) => {
                if (err) {
                  console.log(err);
                  res.json({
                    result: "fail",
                    message: "사용자 예약 등록 실패",
                  });
                }
              });
              createdReservation.owner = sharedLocation.owner;
              createdReservation.save((err) => {
                if (err) {
                  res.json({
                    result: "fail",
                    message: "예약에 소유자 등록 실패",
                  });
                }
              });
              sharedLocation.reservationList.push(createdReservation._id);
              sharedLocation.save((err) => {
                if (err)
                  res.json({
                    result: "fail",
                    message: "배정지 예약 리스트 등록 실패",
                  });
              });
              res.json({ result: "success", message: "예약 완료 되었습니다." });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.json({ result: "fail", message: "사용자 등록 DB ERROR" });
    }
  }
};

const allSharedLocation = async (req, res) => {
  console.log(req.headers["x-forwarded-for"], req.connection.remoteAddress);
  try {
    const allSharedLocations = await SharedLocation.find({ state: 1 })
      .select("location latitude longitude parkingInfo timeState description")
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
  res.render("getAddress");
};
const sharedLocationReserveList = async (req, res) => {
  const {
    query: { locationId },
  } = req;

  const reserveList = await SharedLocation.findOne({
    _id: locationId,
  })
    .select("reservationList possibleStartTime possibleEndTime timeState")
    .populate({ path: "reservationList", select: "startTime endTime" });
  let data = [];
  for (var e of reserveList.reservationList) {
    if (changeMonth(e.startTime.slice(4, 7)) === moment().format("MM")) {
      if (
        +e.startTime.slice(8, 10) == +moment().format("DD") + 1 ||
        +e.startTime.slice(8, 10) == +moment().format("DD")
      ) {
        data.push(e);
      }
    } else if (
      +changeMonth(e.startTime.slice(4, 7)) - +moment().format("MM") ==
      1
    ) {
      if (+moment().format("DD") >= 30) {
        if (+e.startTime.slice(8, 10) == 1) {
          data.push(e);
        }
      }
    }
  }

  res.json({
    reservationList: data,
  });
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
      const user = await User.findOne({ userId: req.decoded.userId });
      if (!user.sharingParkingLot) {
        res.json({ result: "fail", message: "주차장을 먼저 공유하세요." });
      } else {
        const location = await SharedLocation.findOne({
          _id: user.sharingParkingLot,
        }).populate({ path: "reservationList", select: "startTime endTime" });
        let SwitchOffResult = true;
        let reservations = location.reservationList.filter(
          (e) =>
            e.startTime.slice(8, 10) == moment().format("DD") &&
            changeMonth(e.startTime.slice(4, 7)) == moment().format("MM")
        );
        for (var e of reservations) {
          console.log(e);
          if (new Date().getTime() <= new Date(e.endTime).getTime())
            SwitchOffResult = false;
        }
        const todayIndex = changeDay(moment().format("ddd"));

        if (turn == 1) {
          location.timeState.set(todayIndex, 1);
        } else if (turn == 0) {
          if (SwitchOffResult == true) location.timeState.set(todayIndex, 0);
          else {
            res.json({
              result: "fail",
              message: "현재 예약이 있으므로 공유 중지 불가",
            });
            return;
          }
        }
        location.save((err) => {
          if (err) {
            console.log(err);
          } else {
            if (turn == 0) res.json({ result: "success", message: "공유 Off" });
            else if (turn == 1)
              res.json({ result: "success", message: "공유 On" });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};
const locationInfo = async function (req, res) {
  const {
    query: { locationId },
  } = req;
  const locationInfo = await SharedLocation.findOne({ _id: locationId }).select(
    "possibleStartTime possibleEndTime timeState"
  );
  res.json({ locationInfo: locationInfo });
};

const notUserReservationEnroll = async (req, res) => {
  console.log(req);
  const {
    body: {
      _id,
      carNumber,
      startTime,
      endTime,
      phoneNumber,
      name,
      sum,
      deviceToken,
    },
  } = req;

  try {
    const reservation = await Reservation({
      location: _id,
      carNumber,
      notUserPhoneNumber: phoneNumber,
      notUserName: name,
      startTime,
      endTime,
      sum,
      notUserDeviceToken: deviceToken,
    });

    const sharedLocation = await SharedLocation.findOne({ _id }).populate({
      path: "reservationList",
      select: "startTime endTime",
    });

    let sharedResult = true;
    let result = true;

    if (
      sharedLocation.timeState[changeDay(startTime.slice(0, 3))] == 0 ||
      sharedLocation.timeState[changeDay(endTime.slice(0, 3))] == 0
    )
      sharedResult = false;

    for (var e of sharedLocation.reservationList) {
      if (
        new Date(e.startTime).getTime() <
          new Date(reservation.endTime).getTime() &&
        new Date(reservation.endTime).getTime() < new Date(e.endTime).getTime()
      )
        result = false;
      else if (
        new Date(e.startTime).getTime() <
          new Date(reservation.startTime).getTime() &&
        new Date(reservation.startTime).getTime() <
          new Date(e.endTime).getTime()
      )
        result = false;
    }

    if (sharedResult == false) {
      res.json({
        result: "fail",
        message: "해당 주차장은 오늘 공유가 종료되었습니다.",
      });
    } else {
      if (
        possibleTimeCheck(
          sharedLocation.possibleStartTime,
          sharedLocation.possibleEndTime,
          reservation.startTime,
          reservation.endTime
        ) == false
      )
        res.json({ result: "fail", message: "가능한 시간대가 아닙니다." });
      else {
        if (result == false) {
          res.json({
            result: "fail",
            message: "해당 시간은 예약이 되어 있습니다.",
          });
        } else {
          const createdReservation = await Reservation.create(reservation);

          createdReservation.save((err) => {
            if (err) {
              res.json({
                result: "fail",
                message: "예약에 소유자 등록 실패",
              });
            }
          });
          sharedLocation.reservationList.push(createdReservation._id);
          sharedLocation.save((err) => {
            if (err)
              res.json({
                result: "fail",
                message: "배정지 예약 리스트 등록 실패",
              });
          });
          res.json({ result: "success", message: "예약 완료 되었습니다." });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ result: "fail", message: "사용자 등록 DB ERROR" });
  }
};

const changeLocation = async (req, res) => {
  const {
    body: { _id },
  } = req;
  try {
    const reservation = await Reservation.findOne({ _id }).populate({
      path: "location",
      select: "latitude longitude",
    });
    if (!reservation) {
      res.json({ result: "fail", message: "존재하지 않는 예약입니다." });
    }
    const lat = +reservation.location.latitude;
    const long = +reservation.location.longitude;

    const locations = await SharedLocation.find({});

    locations.sort(
      (a, b) =>
        Math.pow(+a.latitude - lat, 2) +
        Math.pow(+a.longitude - long, 2) -
        (Math.pow(+b.latitude - lat, 2) + Math.pow(+b.longitude - long, 2))
    );
    //자기 예약 뺴고
    locations.shift();
    let result = true;
    for (var e of locations) {
      let possibleResult = true;
      if (
        possibleTimeCheck(
          e.possibleStartTime,
          e.possibleEndTime,
          reservation.startTime,
          reservation.endTime
        ) == false
      )
        possibleResult = false;

      if (
        e.timeState[changeDay(reservation.startTime.slice(0, 3))] == 0 ||
        e.timeState[changeDay(reservation.endTime.slice(0, 3))] == 0
      )
        possibleResult = false;

      for (var i of e.reservationList) {
        if (
          new Date(i.startTime).getTime() <
            new Date(reservation.endTime).getTime() &&
          new Date(reservation.endTime).getTime() <
            new Date(i.endTime).getTime()
        )
          possibleResult = false;
        else if (
          new Date(i.startTime).getTime() <
            new Date(reservation.startTime).getTime() &&
          new Date(reservation.startTime).getTime() <
            new Date(i.endTime).getTime()
        )
          possibleResult = false;
      }

      result = possibleResult;

      if (result == true) {
        res.json({
          result: "success",
          _id: e._id,
          parkingInfo: e.parkingInfo,
          location: e.location,
          latitude: e.latitude,
          longitude: e.longitude,
          description: e.description,
        });
        break;
      }
    }
    if (result == false)
      res.json({
        result: "fail",
        message: "주변에 바꿔드릴 장소가 없습니다. 죄송합니다",
      });
  } catch (err) {
    console.log(err);
    res.json({ result: "fail", message: "DB 오류 " });
  }
};
const changeReservation = async (req, res) => {
  const {
    body: { _id, locationId },
  } = req;
  const reservation = await (
    await Reservation.findOne({ _id: reservationId })
  ).populate({ path: "location", select: "_id" });
  if (reservation.client) {
    //회원
    try {
      const location = await SharedLocation.findOne({
        _id: reservation.location._id,
      });
      const changedLocation = await SharedLocation.findOne({
        _id: locationId,
      });
      reservation.location = locationId;
      location.reservationList.pull(reservationId);
      changedLocation.reservationList.push(reservationId);
      reservation.save((e) =>
        res.json({ result: "fail", message: "예약 위치 변경 실패" })
      );
      location.save((e) =>
        res.json({ result: "fail", message: "기존 위치에 예약 삭제" })
      );
      changedLocation.save((e) =>
        res.json({ result: "fail", message: "변경할 위치에 예약 등록 실패" })
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    //비회원
  }
};
apiRouter.post("/auth", getUserInfo);
apiRouter.post("/sharedLocation/enroll", uploadImage, sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/reservation/notUser/enroll", notUserReservationEnroll);
apiRouter.post("/allSharedLocation", allSharedLocation);
apiRouter.get("/reserveList", sharedLocationReserveList);
apiRouter.get("/getAddress", getAddress);
apiRouter.get("/locationInfo", locationInfo);
apiRouter.post("/shareInfo", shareInfo);
apiRouter.post("/sharingSwitch", sharingSwitch);
apiRouter.post("/sendShareInfo", updateShareInfo);
apiRouter.post("/illegal/change", changeLocation);
apiRouter.post("/illegal/changeReservation", changeReservation);

export default apiRouter;
