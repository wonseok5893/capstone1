import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  carNumber: { type: String },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "SharedLocation" },
  startTime: { type: Date },
  endTime: { type: Date },
  sum: { type: Number },
  state: { type: Number, enum: [-1, 0, 1], default: 0 }, //-1 지난예약 대기중 0 1 예약상태
  reservationTime: { type: Date, default: Date.now },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Reservation", ReservationSchema);

export default model;
