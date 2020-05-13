import mongoose from "mongoose";

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
  userPhone: { type: String, required: true, trim: true },
  userCarNumber: { type: String, trim: true },
  created: { type: Date, default: Date.now },
  point: { type: Number, default: 0 },
  reservation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
  sharingParkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SharedLocation",
  },
  state: { type: Number, default: 0, enum: [0, 1] },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("User", UserSchema);

export default model;
