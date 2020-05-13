"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var UserSchema = new _mongoose["default"].Schema({
  userId: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  userPassword: {
    type: String,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  userPhone: {
    type: String,
    required: true,
    trim: true
  },
  userCarNumber: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    "default": Date.now
  },
  point: {
    type: Number,
    "default": 0
  },
  reservation: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Reservation"
  }],
  sharingParkingLot: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "SharedLocation"
  },
  state: {
    type: Number,
    "default": 0,
    "enum": [0, 1]
  },
  id: _mongoose["default"].Schema.Types.ObjectId
});

var model = _mongoose["default"].model("User", UserSchema);

var _default = model;
exports["default"] = _default;