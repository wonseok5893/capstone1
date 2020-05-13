"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var ReservationSchema = new _mongoose["default"].Schema({
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  client: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  location: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "SharedLocation"
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  sum: {
    type: Number
  },
  state: {
    type: Number,
    "enum": [-1, 0, 1],
    "default": 0
  },
  //-1 지난예약/ 0 관리자 승인시 까지 보류중/ , 1/ 예약상태
  reservationTime: {
    type: Date,
    "default": Date.now
  },
  id: _mongoose["default"].Schema.Types.ObjectId
});

var model = _mongoose["default"].model("Reservation", ReservationSchema);

var _default = model;
exports["default"] = _default;