import mongoose from "mongoose";
import moment from "moment";

const SharedLocationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reservationList: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
  ],
  userCarNumber: { type: String, required: true },
  userBirth: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  possibleStartTime: { type: String, default: "00:00" }, //등록 시작 시간
  possibleEndTime: { type: String, default: "00:00" }, //등록 종료 시간
  state: { type: Number, default: 0, enum: [0, 1] }, // 등록 신청한 공유주차장 / 등록된 공유주차장
  currentState: { type: Number, default: 0, enum: [-1, 0, 1] }, //공유중 0 //공유 안 하는중 -1// 이용중 1
  timeState: [{ type: Number, default: 0, enum: [0, 1] }], //일 월 화 수 목 금 토
  filePath: { type: String },
  parkingInfo: { type: String, required: true },
  enrollTime: {
    type: String,
    default: moment().format("YYYY년 MM월 DD일 HH:mm:ss"),
  },
  change: { type: Number, default: 0, enum: [0, 1] },
});

const model = mongoose.model("SharedLocation", SharedLocationSchema);

export default model;
