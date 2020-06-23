"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config(); // local 1 2 cloud
// const localDBURL = "mongodb://localhost:27017/parkingApp";
//cloud MONGODB_URL


_mongoose["default"].connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false
});

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  return console.log("Connected to DB");
};

var handleError = function handleError(error) {
  return console.log("Error on DB Connection: ".concat(error));
};

db.once("open", handleOpen);
db.on("error", handleError);
var _default = db;
exports["default"] = _default;