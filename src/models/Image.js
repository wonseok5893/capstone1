import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: { type: String },
  filePath: { type: String },
  id: mongoose.Schema.Types.ObjectId,
});

const model = mongoose.model("Image", ImageSchema);

export default model;
