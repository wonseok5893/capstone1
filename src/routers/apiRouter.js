import express from "express";
import User from "../models/User";
const apiRouter = express.Router();

// const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };
export const getUserInfo = async function (req, res) {
  if (!req.decoded) {
    res.json({
      result: "fail",
      message: "유저 정보를 가져오는데 실패 했습니다. 인증 오류",
    });
  } else {
    console.log(req.decoded);
    const user = await User.findOne({ userId: req.decoded.userId });
    console.log(user);
    res.json(user);
  }
};

apiRouter.post("/auth", getUserInfo);

export default apiRouter;
