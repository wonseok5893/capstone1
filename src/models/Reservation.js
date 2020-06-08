import mongoose from "mongoose";
import moment from "moment";

const ReservationSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  carNumber: { type: String },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "SharedLocation" },
  startTime: { type: String },
  endTime: { type: String },
  sum: { type: Number },
  reservationTime: {
    type: String,
    default: moment().format("YYYY년 MM월 DD일 HH:mm:ss"),
  },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Reservation", ReservationSchema);

export default model;
