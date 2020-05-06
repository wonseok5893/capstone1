"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var UserSchema = new _mongoose["default"].Schema({
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    index: {
      unique: true
    }
  },
  userPassword: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  userCarNumber: {
    type: String,
    required: true
  }
});

var model = _mongoose["default"].model("User", UserSchema);

var _default = model;
exports["default"] = _default;