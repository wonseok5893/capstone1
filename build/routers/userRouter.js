"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.postJoin = exports.postLogin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _User = _interopRequireDefault(require("../models/User"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var userRouter = _express["default"].Router();

var postLogin = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, userId, userPassword, secret, user;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.decoded) {
              _context.next = 9;
              break;
            }

            _req$body = req.body, userId = _req$body.userId, userPassword = _req$body.userPassword; //SERCRET

            secret = req.app.get("jwt-secret");
            _context.next = 5;
            return _User["default"].findOne({
              userId: userId
            });

          case 5:
            user = _context.sent;

            if (user) {
              console.log(user);

              if (user.userId === userId && user.userPassword === userPassword) {
                //토큰 발급
                _jsonwebtoken["default"].sign({
                  _id: user._id,
                  userId: user.userId
                }, secret, {
                  expiresIn: "7d",
                  //만료기간
                  issuer: "parkingReservation.herokuApp.com",
                  subject: "userInfo"
                }, function (err, token) {
                  if (!err) {
                    res.json({
                      result: "success",
                      message: "".concat(userId, "\uB85C \uB85C\uADF8\uC778 \uC131\uACF5"),
                      token: token
                    });
                  }
                });
              } else {
                res.json({
                  result: "fail",
                  message: "로그인 실패. ID/PW를 확인해주세요"
                });
              }
            }

            _context.next = 11;
            break;

          case 9:
            console.log(req.user);
            res.json({
              result: "success",
              message: "자동 로그인 성공"
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function postLogin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.postLogin = postLogin;

var postJoin = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body2, userId, userPassword, userEmail, userPhone, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req);
            _req$body2 = req.body, userId = _req$body2.userId, userPassword = _req$body2.userPassword, userEmail = _req$body2.userEmail, userPhone = _req$body2.userPhone;

            if (!(userId == null || userPassword == null || userEmail == null || userPhone == null)) {
              _context2.next = 6;
              break;
            }

            res.json({
              result: "fail"
            });
            _context2.next = 19;
            break;

          case 6:
            _context2.prev = 6;
            _context2.next = 9;
            return (0, _User["default"])({
              userId: userId,
              userPassword: userPassword,
              userEmail: userEmail,
              userPhone: userPhone
            });

          case 9:
            user = _context2.sent;
            _context2.next = 12;
            return _User["default"].create(user);

          case 12:
            res.json({
              result: "success"
            });
            _context2.next = 19;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](6);
            console.log(_context2.t0);
            res.json({
              result: "fail"
            });

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 15]]);
  }));

  return function postJoin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postJoin = postJoin;

var getJoin = function getJoin(req, res) {
  res.send("회원가입 페이지입니다!");
};

userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);
var _default = userRouter;
exports["default"] = _default;