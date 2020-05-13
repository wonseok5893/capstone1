import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "SharedLocation" },
  startTime: { type: Date },
  endTime: { type: Date },
  sum: { type: Number },
  state: { type: Number, enum: [-1, 0, 1], default: 0 }, //-1 지난예약/ 0 관리자 승인시 까지 보류중/ , 1/ 예약상태
  reservationTime: { type: Date, default: Date.now },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Reservation", ReservationSchema);

export default model;
