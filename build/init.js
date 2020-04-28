"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("./db");

var _app = _interopRequireDefault(require("./app"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var handleListening = function handleListening() {
  return console.log("Server is Opened: https://parkingReservation.herokuapp.com");
};

_app["default"].listen(process.env.PORT || 5800, handleListening);