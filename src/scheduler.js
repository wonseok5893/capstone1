import { scheduleJob } from "node-schedule";
import moment from "moment";
import "moment-timezone";
import SharedLocation from "../build/models/SharedLocation";
import Reservation from "../build/models/Reservation";

const dbSharedLocation = async () => {
  try {
    // const reservation = await Reservation.find({});
    // console.log(reservation);
    // const user = await User.findOne({ userId: req.decoded.userId });
    // console.log(user.reservation);
    // user.reservation.pull(_id);
    // user.save((err) => console.log(err));
    // const sharedlocation = await SharedLocation.findOne({
    //   _id: reservation.location,
    // });
    // sharedlocation.reservationList.pull(_id);
    // sharedlocation.save((err) => {
    //   if (err) console.log(err);
    // });
    // await Reservation.findByIdAndDelete({ _id }, (err) => {
    //   if (err) res.json({ result: "fail", message: "삭제 실패" });
    //   else {
    //     res.json({ result: "success", message: "삭제 완료" });
    //   }
    // });
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
