import mongoose from "mongoose";
import moment from "moment";

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  userPassword: { type: String, required: true, trim: true },
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, trim: true },
  userBirth: { type: String },
  userPhone: { type: String, required: true, trim: true },
  userCarNumber: [{ type: String, trim: true }],
  created: {
    type: String,
    default: moment().format("YYYY년 MM월 DD일 HH:mm:ss"),
  },
  point: { type: Number, default: 0 },
  reservation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
  sharingParkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SharedLocation",
  },
  state: { type: Number, default: 0, enum: [0, 1] },
  deviceToken: { type: String },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("User", UserSchema);

export default model;
