import express from "express";
import User from "../models/User";

const userRouter = express.Router();

export const postLogin = async (req, res) => {
  const {
    body: { userId, userPassword },
  } = req;
  const user = await User.findOne({ userId });

  console.log(user);
  if (user.userId === userId && user.userPassword === userPassword)
    res.json({ result: "success" });
  else {
    res.json({ result: "fail" });
  }
};

export const postJoin = async (req, res) => {
  console.log(req);
  const {
    body: { userId, userPassword, userEmail, userPhone },
  } = req;
  if (
    userId == null ||
    userPassword == null ||
    userEmail == null ||
    userPhone == null
  ) {
    res.json({ result: "fail" });
  } else {
    try {
      const user = await User({
        userId,
        userPassword,
        userEmail,
        userPhone,
      });
      await User.create(user);
      res.json({ result: "success" });
    } catch (error) {
      console.log(error);
      res.json({ result: "fail" });
    }
  }
};
const getJoin = function (req, res) {
  res.send("회원가입 페이지입니다!");
};
userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);

export default userRouter;
