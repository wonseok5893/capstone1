import mongoose from "mongoose";
import moment from "moment";

const ReservationSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  carNumber: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "SharedLocation" },
  notUserPhoneNumber: { type: String },
  notUserName: { type: String },
  notUserDeviceToken: { type: String },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  sum: { type: Number, required: true },
  reservationTime: {
    type: String,
    default: moment().format("YYYY년 MM월 DD일 HH:mm:ss"),
  },
  purpose: { type: Number, enum: [0, 1], default: 0 },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Reservation", ReservationSchema);

export default model;
