"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeSchedule = require("node-schedule");

var _moment = _interopRequireDefault(require("moment"));

require("moment-timezone");

var startTime = new Date(Date.now() + 5000);
var endTime = new Date(startTime.getTime() + 5000);

var _default = function _default() {
  (0, _nodeSchedule.scheduleJob)({
    rule: "0 * * * * *"
  }, function () {
    console.log("DB\uAC31\uC2E0: ".concat((0, _moment["default"])().format("YYYY년 MM월 DD일 hh시mm분ss초")));
  });
};

exports["default"] = _default;