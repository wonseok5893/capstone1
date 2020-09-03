"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminCheck = exports.jwtMiddleware = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var jwtMiddleware = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers["x-access-token"] || req.query.token;

            if (!(!token || token === "")) {
              _context.next = 5;
              break;
            }

            next();
            _context.next = 7;
            break;

          case 5:
            _context.next = 7;
            return _jsonwebtoken["default"].verify(token, process.env.SECRET, function (err, decoded) {
              if (!err) {
                req.decoded = decoded;

                if (req.decoded.userId === "wonseok") {
                  if (req.connection.remoteAddress === "::ffff:192.168.0.1" || req.connection.remoteAddress === "::ffff:203.249.1.210") {
                    console.log("관리자 로그인 성공");
                    next();
                  } else {
                    res.json({
                      result: "fail",
                      message: "잘못된 접근"
                    });
                  }
                } else {
                  console.log("세션 로그인 성공");
                  next();
                }
              } else {
                res.status(403).json({
                  result: "fail",
                  message: "Token error. 다시 로그인 해주세요."
                });
              }
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function jwtMiddleware(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.jwtMiddleware = jwtMiddleware;

var adminCheck = function adminCheck(req, res, next) {
  if (req.connection.remoteAddress === "::ffff:192.168.0.1" || req.connection.remoteAddress === "::ffff:203.249.1.210") next();else {
    res.status(403).json({
      result: "fail",
      message: "잘못된 접근"
    });
  }
};

exports.adminCheck = adminCheck;