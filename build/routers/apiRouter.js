"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getUserInfo = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _User = _interopRequireDefault(require("../models/User"));

var apiRouter = _express["default"].Router(); // const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };


var getUserInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.decoded) {
              _context.next = 4;
              break;
            }

            res.json({
              result: "fail",
              message: "유저 정보를 가져오는데 실패 했습니다. 인증 오류"
            });
            _context.next = 10;
            break;

          case 4:
            console.log(req.decoded);
            _context.next = 7;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 7:
            user = _context.sent;
            console.log(user);
            res.json(user);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getUserInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getUserInfo = getUserInfo;
apiRouter.post("/auth", getUserInfo);
var _default = apiRouter;
exports["default"] = _default;