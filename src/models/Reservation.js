import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reservationId: mongoose.Schema.Types.ObjectId,
  location: { type: mongoose.Schema.Types.ObjectId, ref: "SharedLocation" },
  startTime: { type: Date },
  endTime: { type: Date },
  sum: { type: Number },
  state: { type: Number, enum: [-1, 0, 1], default: 0 }, //-1 지난예약, 0 , 1 예약상태
  reservationTime: { type: Date, default: Date.now },
});

const model = mongoose.model("Reservation", ReservationSchema);

export default model;
