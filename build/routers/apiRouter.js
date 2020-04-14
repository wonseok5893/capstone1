"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRouter = _express["default"].Router(); // const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };


var getUserInfo = function getUserInfo(req, res) {
  console.log(req);
  res.send("home");
};

apiRouter.get("/", getUserInfo);
var _default = apiRouter;
exports["default"] = _default;