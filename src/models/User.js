import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: String,
  userPassword: String,
  userEmail: String,
  userPhone: String,
});

const model = mongoose.model("User", UserSchema);

export default model;