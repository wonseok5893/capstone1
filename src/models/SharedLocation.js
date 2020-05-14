import mongoose from "mongoose";

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
  state: { type: Number, default: 0, enum: [0, 1] },
  filePath: { type: String, required: true },
  parkingInfo: { type: String, required: true },
  enrollTime: { type: Date, default: Date.now },
});

const model = mongoose.model("SharedLocation", SharedLocationSchema);

export default model;
