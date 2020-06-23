"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

var ReservationSchema = new _mongoose["default"].Schema({
  client: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  carNumber: {
    type: String,
    required: true
  },
  location: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "SharedLocation"
  },
  notUserPhoneNumber: {
    type: String
  },
  notUserName: {
    type: String
  },
  notUserDeviceToken: {
    type: String
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  sum: {
    type: Number,
    required: true
  },
  reservationTime: {
    type: String,
    "default": (0, _moment["default"])().format("YYYY년 MM월 DD일 HH:mm:ss")
  },
  purpose: {
    type: Number,
    "enum": [0, 1],
    "default": 0
  },
  id: _mongoose["default"].Schema.Types.ObjectId
});

var model = _mongoose["default"].model("Reservation", ReservationSchema);

var _default = model;
exports["default"] = _default;