"use strict";

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var handleListening = function handleListening() {
  return console.log("Server is Opened: https://parkingReservation.herokuapp.com:".concat(process.env.PORT));
};

_app["default"].listen(process.env.PORT || 5800, handleListening);