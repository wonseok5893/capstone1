"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeSchedule = require("node-schedule");

var _default = function _default(arg) {
  (0, _nodeSchedule.scheduleJob)("*/1 * * * *", function () {
    console.log("in doStuff. The time is: ".concat(new Date()));
    console.log("And your arg was: ".concat(arg));
  });
};

exports["default"] = _default;