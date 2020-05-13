"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var ImageSchema = new _mongoose["default"].Schema({
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  fileName: {
    type: String
  },
  filePath: {
    type: String
  },
  id: _mongoose["default"].Schema.Types.ObjectId
});

var model = _mongoose["default"].model("Image", ImageSchema);

var _default = model;
exports["default"] = _default;