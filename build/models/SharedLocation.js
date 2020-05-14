"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var SharedLocationSchema = new _mongoose["default"].Schema({
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  reservationList: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Reservation"
  }],
  userCarNumber: {
    type: String,
    required: true
  },
  userBirth: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    "default": 0,
    "enum": [0, 1]
  },
  filePath: {
    type: String,
    required: true
  },
  parkingInfo: {
    type: String,
    required: true
  },
  enrollTime: {
    type: Date,
    "default": Date.now
  }
});

var model = _mongoose["default"].model("SharedLocation", SharedLocationSchema);

var _default = model;
exports["default"] = _default;