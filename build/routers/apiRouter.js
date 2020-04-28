"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var apiRouter = _express["default"].Router(); // const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };


var getUserInfo = function getUserInfo(req, res) {
  res.send("home");
};

apiRouter.get("/", getUserInfo);
var _default = apiRouter;
exports["default"] = _default;