"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

var NoticeSchema = new _mongoose["default"].Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  enrollTime: {
    type: String,
    "default": (0, _moment["default"])().format("YYYY년 MM월 DD일 HH:mm:ss")
  },
  id: _mongoose["default"].Schema.Types.ObjectId
});

var model = _mongoose["default"].model("Notice", NoticeSchema);

var _default = model;
exports["default"] = _default;