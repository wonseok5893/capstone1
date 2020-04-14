"use strict";

require("./db");

var _app = _interopRequireDefault(require("./app"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var handleListening = function handleListening() {
  return console.log("Server is Opened: https://parkingReservation.herokuapp.com");
};

_app["default"].listen(process.env.PORT || 5800, handleListening);