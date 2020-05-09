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
    var _req$body2, userId, userPassword, userName, userEmail, userPhone, userCarNumber, userIdCheck, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req);
            _req$body2 = req.body, userId = _req$body2.userId, userPassword = _req$body2.userPassword, userName = _req$body2.userName, userEmail = _req$body2.userEmail, userPhone = _req$body2.userPhone, userCarNumber = _req$body2.userCarNumber;
            _context2.prev = 2;
            _context2.next = 5;
            return _User["default"].findOne({
              userId: userId
            });

          case 5:
            userIdCheck = _context2.sent;

            if (!(userIdCheck !== null)) {
              _context2.next = 10;
              break;
            }

            res.json({
              result: "fail",
              message: "이미 존재하는 ID가 있습니다."
            });
            _context2.next = 16;
            break;

          case 10:
            _context2.next = 12;
            return (0, _User["default"])({
              userId: userId,
              userPassword: userPassword,
              userName: userName,
              userEmail: userEmail,
              userPhone: userPhone,
              userCarNumber: userCarNumber
            });

          case 12:
            user = _context2.sent;
            _context2.next = 15;
            return _User["default"].create(user);

          case 15:
            res.json({
              result: "success",
              message: "회원가입 성공"
            });

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](2);
            console.log(_context2.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 18]]);
  }));

  return function postJoin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postJoin = postJoin;

var getJoin = function getJoin(req, res) {
  res.send("회원가입 페이지입니다!");
};

var changePassword = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var userId, _req$body3, beforeUserPassword, newUserPassword, user;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.decoded.userId;
            _req$body3 = req.body, beforeUserPassword = _req$body3.userPassword, newUserPassword = _req$body3.newUserPassword;
            console.log(beforeUserPassword, newUserPassword);
            _context3.prev = 3;
            _context3.next = 6;
            return _User["default"].findOne({
              userId: userId
            });

          case 6:
            user = _context3.sent;

            if (beforeUserPassword === user.userPassword) {
              user.userPassword = newUserPassword;
              user.save(function (err) {
                if (err) res.json({
                  result: "fail",
                  message: "db 저장 실패"
                });else {
                  res.json({
                    result: "success",
                    message: "비밀번호를 변경하였습니다."
                  });
                }
              });
            } else {
              res.json({
                result: "fail",
                message: "이전 비밀번호를 확인해주세요."
              });
            }

            _context3.next = 14;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](3);
            res.json({
              result: "fail",
              message: "해당하는 유저가 없습니다."
            });
            console.log(_context3.t0);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 10]]);
  }));

  return function changePassword(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var changePhone = function changePhone(req, res) {};

var changeId = function changeId(req, res) {};

userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);
userRouter.post("/editPassword", changePassword);
var _default = userRouter;
exports["default"] = _default;