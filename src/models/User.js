import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },

  userId: {
    type: String,
    index: {
      unique: true,
    },
  },
  userPassword: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  userCarNumber: { type: String, required: true },
});

const model = mongoose.model("User", UserSchema);

export default model;
