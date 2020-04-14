"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config(); // local 1 2 cloud
// const localDBURL = "mongodb://localhost:27017/parkingApp";
//cloud MONGODB_URL


_mongoose["default"].connect(process.env.localDBURL, {
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