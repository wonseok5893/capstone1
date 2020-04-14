"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var globalRouter = _express["default"].Router();

var getHome = function getHome(req, res) {
  console.log(req);
  res.send("주차장 예약 시스템에 오신 것을 환영합니다!");
};

globalRouter.get("/", getHome);
var _default = globalRouter;
exports["default"] = _default;