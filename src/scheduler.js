import { scheduleJob } from "node-schedule";
import moment from "moment";
import "moment-timezone";
import SharedLocation from "../build/models/SharedLocation";
import Reservation from "../build/models/Reservation";
import User from "../build/models/User";
import { sendMessage } from "./pushAlarm";

const dbSharedLocation = async () => {
  try {
    const reservations = await Reservation.find({}).select(
      "_id client startTime endTime notUserDeviceToken"
    );

    const nowTime = new Date().getTime();

    //시작 10분전인 예약
    let reservationList = reservations.filter(
      (e) =>
        new Date(e.startTime).getTime() - nowTime <= 602000 &&
        new Date(e.startTime).getTime() - nowTime > 540000
    );
    //종료 10분전인 예약
    let endReservationList = reservations.filter(
      (e) =>
        new Date(e.endTime).getTime() - nowTime <= 602000 &&
        new Date(e.endTime).getTime() - nowTime > 540000
    );

    if (reservationList.length != 0) {
      let deviceTokens = [];
      for (var e of reservationList) {
        //비사용자
        if (!e.client) {
          console.log("비회원 토큰" + e.notUserDeviceToken);
          deviceTokens.push(e.notUserDeviceToken);
        } else {
          const user = await User.findOne({ _id: e.client }).select(
            "deviceToken"
          );
          console.log("회원 토큰" + user.deviceToken);
          deviceTokens.push(user.deviceToken);
        }
      }

      console.log("푸시 보낼 토큰", e);
      for (var e of deviceTokens) {
        sendMessage(
          e,
          "예약시간 확인",
          "예약하신 주차 시작 시간 10분 전입니다."
        );
      }
    }

    if (endReservationList.length != 0) {
      let Tokens = [];
      for (var e of endReservationList) {
        //비사용자
        if (!e.client) {
          Tokens.push(e.notUserDeviceToken);
        } else {
          const user = await User.findOne({ _id: e.client }).select(
            "deviceToken"
          );
          console.log(user);
          Tokens.push(user.deviceToken);
        }
      }

      for (var e of Tokens) {
        sendMessage(
          e,
          "종료시간 확인",
          "종료시간 10분 전입니다. 종료시에 지난 예약에서 리뷰를 작성해주시면 포인트를 드립니다."
        );
      }
    }
  } catch (error) {
    console.log("db갱신 ERROR" + error);
  }
};

export default () => {
  scheduleJob({ rule: "0 * * * * *" }, () => {
    console.log(`db갱신: ${moment().format("YYYY년 MM월 DD일 hh:mm:ss")}`);
    dbSharedLocation();
  });
};
