"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var NoticeSchema = new _mongoose["default"].Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  enrollTime: {
    type: Date,
    "default": Date.now
  },
  id: _mongoose["default"].Schema.Types.ObjectId
});

var model = _mongoose["default"].model("Notice", NoticeSchema);

var _default = model;
exports["default"] = _default;