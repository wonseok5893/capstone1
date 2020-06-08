"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.postJoin = exports.postLogin = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _User = _interopRequireDefault(require("../models/User"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _SharedLocation = _interopRequireDefault(require("../models/SharedLocation"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
                    console.log("로그인 성공");
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
    var _req$body2, userId, userPassword, userName, userEmail, userPhone, userIdCheck, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req);
            _req$body2 = req.body, userId = _req$body2.userId, userPassword = _req$body2.userPassword, userName = _req$body2.userName, userEmail = _req$body2.userEmail, userPhone = _req$body2.userPhone;
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
              userPhone: userPhone
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
            console.log("비밀번호 변경 요청", req);
            userId = req.decoded.userId;
            _req$body3 = req.body, beforeUserPassword = _req$body3.userPassword, newUserPassword = _req$body3.newUserPassword;
            console.log(beforeUserPassword, newUserPassword);
            _context3.prev = 4;
            _context3.next = 7;
            return _User["default"].findOne({
              userId: userId
            });

          case 7:
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

            _context3.next = 15;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](4);
            res.json({
              result: "fail",
              message: "해당하는 유저가 없습니다."
            });
            console.log(_context3.t0);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 11]]);
  }));

  return function changePassword(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var myReservationList = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var reservations, locationInfo, data, locationData, _iterator, _step, e, sharedlocation;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!req.decoded) {
              res.json({
                result: "fail",
                message: "잘못된 접근입니다."
              });
            }

            _context4.prev = 1;
            _context4.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            }).populate({
              path: "reservation",
              select: "startTime endTime carNumber location"
            });

          case 4:
            reservations = _context4.sent;
            locationInfo = {};
            data = reservations.reservation;
            locationData = [];
            _iterator = _createForOfIteratorHelper(data);
            _context4.prev = 9;

            _iterator.s();

          case 11:
            if ((_step = _iterator.n()).done) {
              _context4.next = 26;
              break;
            }

            e = _step.value;
            _context4.next = 15;
            return _SharedLocation["default"].findOne({
              _id: e.location
            }, "location parkingInfo");

          case 15:
            sharedlocation = _context4.sent;
            locationInfo.startTime = e.startTime;
            locationInfo.endTime = e.endTime;
            locationInfo.carNumber = e.carNumber;
            locationInfo.location = sharedlocation.location;
            locationInfo.parkingInfo = sharedlocation.parkingInfo;
            locationData.push(locationInfo);
            e.locationData = locationData;
            locationInfo = {};

          case 24:
            _context4.next = 11;
            break;

          case 26:
            _context4.next = 31;
            break;

          case 28:
            _context4.prev = 28;
            _context4.t0 = _context4["catch"](9);

            _iterator.e(_context4.t0);

          case 31:
            _context4.prev = 31;

            _iterator.f();

            return _context4.finish(31);

          case 34:
            res.json({
              data: locationData
            });
            _context4.next = 40;
            break;

          case 37:
            _context4.prev = 37;
            _context4.t1 = _context4["catch"](1);
            console.log(_context4.t1);

          case 40:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 37], [9, 28, 31, 34]]);
  }));

  return function myReservationList(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var changePhone = function changePhone(req, res) {};

var changeId = function changeId(req, res) {};

var getImage = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var filePath;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            filePath = _path["default"].format({
              dir: "uploads/images",
              base: "1589740033670.jpg"
            });
            console.log((0, _typeof2["default"])(filePath)); // try {
            //   const sharedLocation = await ;
            // } catch (err) {
            //   console.log(err);
            // }

            _fs["default"].readFile(filePath, //파일 읽기
            function (err, data) {
              if (err) console.log(err);else {
                console.log(data); //http의 헤더정보를 클라이언트쪽으로 출력
                //image/jpg : jpg 이미지 파일을 전송한다
                //write 로 보낼 내용을 입력

                res.writeHead(200, {
                  "Context-Type": "image/jpg"
                }); //보낼 헤더를 만듬

                res.write(data); //본문을 만들고

                res.end(); //클라이언트에게 응답을 전송한다
              }
            });

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getImage(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); // async function example(req, res) {
//   const data = await SharedLocation.find({
//     _id: "5ecfbb5cf649dc03ccae5075",
//   }).populate({ path: "reservationList", select: "startTime endTime" });
//   JSON.stringify(data);
//   console.log(data);
//   res.json(JSON.stringify(data));
// }


userRouter.post("/imageTest", getImage);
userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);
userRouter.post("/editPassword", changePassword);
userRouter.post("/myReservation", myReservationList); // userRouter.get("/data", example);

var _default = userRouter;
exports["default"] = _default;