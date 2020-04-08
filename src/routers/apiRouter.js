import express from "express";

const apiRouter = express.Router();

const getInfo = function (req, res) {
  res.send("hello");
};

apiRouter.get("/", getInfo);
export default apiRouter;
