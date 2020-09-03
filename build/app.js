"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _helmet = _interopRequireDefault(require("helmet"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _globalRouter = _interopRequireDefault(require("./routers/globalRouter"));

var _apiRouter = _interopRequireDefault(require("./routers/apiRouter"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _jwtMiddleware = require("./jwtMiddleware");

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use((0, _helmet["default"])());
app.set("views", _path["default"].join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("/", _path["default"].join(__dirname, "/"));
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])());
app.use((0, _morgan["default"])("dev"));
app.use("/uploads/images", _express["default"]["static"]("./uploads/images/"));
app.set("jwt-secret", process.env.SECRET);
app.use(_jwtMiddleware.jwtMiddleware);
app.use("/", _globalRouter["default"]);
app.use("/user", _userRouter["default"]);
app.use("/api", _apiRouter["default"]);
var _default = app;
exports["default"] = _default;