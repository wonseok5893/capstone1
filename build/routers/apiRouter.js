"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRouter = _express["default"].Router();

var getInfo = function getInfo(req, res) {
  res.send("hello");
};

apiRouter.get("/", getInfo);
var _default = apiRouter;
exports["default"] = _default;