import mongoose from "mongoose";
import moment from "moment";
const VisitPurposeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "SharedLocation" },
  category: { type: String, required: true },
  description: { type: String },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("visitPurpose", VisitPurposeSchema);

export default model;
