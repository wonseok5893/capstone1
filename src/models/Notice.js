import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  enrollTime: { type: Date, default: Date.now },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Notice", NoticeSchema);

export default model;
