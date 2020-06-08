import { scheduleJob } from "node-schedule";
import moment from "moment";
import "moment-timezone";

const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 5000);

export default () => {
  scheduleJob({ rule: "0 * * * * *" }, () => {
    console.log(`DB갱신: ${moment().format("YYYY년 MM월 DD일 hh시mm분ss초")}`);
  });
};
