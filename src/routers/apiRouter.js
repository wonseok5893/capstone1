import express from "express";

const apiRouter = express.Router();

// const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };
const getUserInfo = function (req, res) {
  console.log(req);
  res.send("home");
};

apiRouter.get("/", getUserInfo);
export default apiRouter;
