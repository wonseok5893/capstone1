import express from "express";

const globalRouter = express.Router();

const getHome = function (req, res) {
  console.log(req);
  res.send("주차장 예약 시스템에 오신 것을 환영합니다!");
};
globalRouter.get("/", getHome);

export default globalRouter;
