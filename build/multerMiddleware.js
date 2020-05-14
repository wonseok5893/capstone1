"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var multerImage = (0, _multer["default"])({
  storage: _multer["default"].diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, "uploads/images/");
    },
    filename: function filename(req, file, cb) {
      cb(null, new Date().valueOf() + _path["default"].extname(file.originalname));
    }
  })
});
var uploadImage = multerImage.single("img");
exports.uploadImage = uploadImage;