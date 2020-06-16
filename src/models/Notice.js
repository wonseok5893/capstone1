import mongoose from "mongoose";
import moment from "moment";

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  enrollTime: {
    type: String,
    default: moment().format("YYYY년 MM월 DD일 HH:mm:ss"),
  },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Notice", NoticeSchema);

export default model;
