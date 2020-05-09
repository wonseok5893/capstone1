import mongoose from "mongoose";

const SharedLocationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reservationList: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
  latitude: { type: String },
  longitude: { type: String },
  price: { type: Number },
  state: { type: Number, default: 0, enum: [0, 1] },
  enrollTime: { type: Date, default: Date.now },
});

const model = mongoose.model("SharedLocation", SharedLocationSchema);

export default model;
