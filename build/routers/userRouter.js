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

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _SharedLocation = _interopRequireDefault(require("../models/SharedLocation"));

var _Reservation = _interopRequireDefault(require("../models/Reservation"));

var _VisitPurpose = _interopRequireDefault(require("../models/VisitPurpose"));

var _pushAlarm = require("../pushAlarm");

var _console = require("console");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var userRouter = _express["default"].Router();

var postLogin = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, userId, userPassword, deviceToken, secret, user;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.decoded) {
              _context.next = 10;
              break;
            }

            _req$body = req.body, userId = _req$body.userId, userPassword = _req$body.userPassword, deviceToken = _req$body.deviceToken; //SERCRET

            secret = req.app.get("jwt-secret");
            _context.next = 5;
            return _User["default"].findOne({
              userId: userId
            });

          case 5:
            user = _context.sent;
            console.log(req);

            if (user) {
              if (user.userId === userId && user.userPassword === userPassword) {
                //관리자 검증
                if (user.userId === "wonseok") {
                  console.log(req.connection.remoteAddress);

                  if (req.connection.remoteAddress === "::ffff:192.168.0.1" || req.connection.remoteAddress === "::ffff:203.249.1.210") {
                    console.log("관리자 로그인 성공");
                  } else {
                    res.json({
                      result: "fail",
                      message: "잘못된 접근"
                    });
                  }
                } //토큰 발급


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

                    if (user.deviceToken) {
                      if (user.deviceToken != deviceToken) {
                        user.deviceToken = deviceToken;
                        user.save(function (e) {
                          if (!e) {
                            console.log("디바이스 토큰 변경 완료");
                          }
                        });
                      }
                    } else {
                      user.deviceToken = deviceToken;
                      user.save(function (e) {
                        if (!e) {
                          console.log("디바이스 토큰 생성 완료");
                        }
                      });
                    }

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

            _context.next = 12;
            break;

          case 10:
            console.log(req.user);
            res.json({
              result: "success",
              message: "자동 로그인 성공"
            });

          case 12:
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
    var _req$body2, userId, userPassword, userName, userEmail, userPhone, deviceToken, userIdCheck, user;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(req);
            _req$body2 = req.body, userId = _req$body2.userId, userPassword = _req$body2.userPassword, userName = _req$body2.userName, userEmail = _req$body2.userEmail, userPhone = _req$body2.userPhone, deviceToken = _req$body2.deviceToken;
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

var myReservationList = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var reservations, locationInfo, data, locationData, _iterator, _step, _e, sharedlocation;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.decoded) {
              _context3.next = 4;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context3.next = 45;
            break;

          case 4:
            _context3.prev = 4;
            _context3.next = 7;
            return _User["default"].findOne({
              userId: req.decoded.userId
            }).populate({
              path: "reservation",
              select: "startTime endTime carNumber location"
            });

          case 7:
            reservations = _context3.sent;
            locationInfo = {};
            data = reservations.reservation;
            locationData = [];
            _iterator = _createForOfIteratorHelper(data);
            _context3.prev = 12;

            _iterator.s();

          case 14:
            if ((_step = _iterator.n()).done) {
              _context3.next = 31;
              break;
            }

            _e = _step.value;
            _context3.next = 18;
            return _SharedLocation["default"].findOne({
              _id: _e.location
            }, "location parkingInfo");

          case 18:
            sharedlocation = _context3.sent;
            console.log();
            locationInfo._id = _e._id;
            locationInfo.startTime = _e.startTime;
            locationInfo.endTime = _e.endTime;
            locationInfo.carNumber = _e.carNumber;
            locationInfo.location = sharedlocation.location;
            locationInfo.parkingInfo = sharedlocation.parkingInfo;
            locationData.push(locationInfo);
            _e.locationData = locationData;
            locationInfo = {};

          case 29:
            _context3.next = 14;
            break;

          case 31:
            _context3.next = 36;
            break;

          case 33:
            _context3.prev = 33;
            _context3.t0 = _context3["catch"](12);

            _iterator.e(_context3.t0);

          case 36:
            _context3.prev = 36;

            _iterator.f();

            return _context3.finish(36);

          case 39:
            res.json({
              data: locationData
            });
            _context3.next = 45;
            break;

          case 42:
            _context3.prev = 42;
            _context3.t1 = _context3["catch"](4);
            console.log(_context3.t1);

          case 45:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 42], [12, 33, 36, 39]]);
  }));

  return function myReservationList(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var changePassword = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var userId, _req$body3, beforeUserPassword, newUserPassword, user;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("비밀번호 변경 요청", req);
            userId = req.decoded.userId;
            _req$body3 = req.body, beforeUserPassword = _req$body3.userPassword, newUserPassword = _req$body3.newUserPassword;
            console.log(beforeUserPassword, newUserPassword);
            _context4.prev = 4;
            _context4.next = 7;
            return _User["default"].findOne({
              userId: userId
            });

          case 7:
            user = _context4.sent;

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

            _context4.next = 15;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](4);
            res.json({
              result: "fail",
              message: "해당하는 유저가 없습니다."
            });
            console.log(_context4.t0);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 11]]);
  }));

  return function changePassword(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var changePhone = function changePhone(req, res) {};

var changeId = function changeId(req, res) {};

var sendImagePath = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _id, sharedLocation;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _id = req.body._id;
            _context5.prev = 1;
            _context5.next = 4;
            return _SharedLocation["default"].findOne({
              _id: _id
            });

          case 4:
            sharedLocation = _context5.sent;
            res.json({
              filePath: sharedLocation.filePath
            });
            _context5.next = 12;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            console.log(_context5.t0);
            res.json({
              result: "fail",
              message: "이미지를 불러올수 없습니다"
            });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 8]]);
  }));

  return function sendImagePath(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var getImage = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _id, sharedLocation;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _id = req.body._id;
            _context6.prev = 1;
            _context6.next = 4;
            return _SharedLocation["default"].findOne({
              _id: _id
            });

          case 4:
            sharedLocation = _context6.sent;

            _fs["default"].readFile(sharedLocation.filePath, //파일 읽기
            function (err, data) {
              if (err) console.log(err);else {
                //http의 헤더정보를 클라이언트쪽으로 출력
                //image/jpg : jpg 이미지 파일을 전송한다
                //write 로 보낼 내용을 입력
                res.writeHead(200, {
                  "Context-Type": "image/jpg"
                }); //보낼 헤더를 만듬

                res.write(data); //본문을 만들고

                res.end(); //클라이언트에게 응답을 전송한다
              }
            });

            _context6.next = 12;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](1);
            console.log(_context6.t0);
            res.json({
              result: "fail",
              message: "이미지를 불러올수 없습니다"
            });

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 8]]);
  }));

  return function getImage(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var userCarEnroll = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var userCarNumber, user;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (req.decoded) {
              _context7.next = 4;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context7.next = 17;
            break;

          case 4:
            userCarNumber = req.body.userCarNumber;
            _context7.prev = 5;
            _context7.next = 8;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 8:
            user = _context7.sent;
            user.userCarNumber.push(userCarNumber);
            user.save(function (err) {
              if (err) res.json({
                result: "fail",
                message: "db 저장 실패"
              });else {
                res.json({
                  result: "success",
                  message: "차량 등록이 되었습니다"
                });
              }
            });
            _context7.next = 17;
            break;

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](5);
            res.json({
              result: "fail",
              message: "db 오류"
            });
            console.log(_context7.t0);

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[5, 13]]);
  }));

  return function userCarEnroll(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var userCarDelete = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var userCarNumber, user;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log(req);

            if (req.decoded) {
              _context8.next = 5;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context8.next = 18;
            break;

          case 5:
            userCarNumber = req.body.userCarNumber;
            _context8.prev = 6;
            _context8.next = 9;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 9:
            user = _context8.sent;
            user.userCarNumber.pull(userCarNumber);
            user.save(function (err) {
              if (err) res.json({
                result: "fail",
                message: "db 저장 실패"
              });else {
                res.json({
                  result: "success",
                  message: "".concat(userCarNumber, " \uCC28\uB7C9\uC744 \uC0AD\uC81C\uD558\uC600\uC2B5\uB2C8\uB2E4. ")
                });
              }
            });
            _context8.next = 18;
            break;

          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8["catch"](6);
            res.json({
              result: "fail",
              message: "db 오류"
            });
            console.log(_context8.t0);

          case 18:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[6, 14]]);
  }));

  return function userCarDelete(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var chargePoint = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var addPoint, user;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log(req);
            addPoint = req.body.point;

            if (req.decoded) {
              _context9.next = 6;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다"
            });
            _context9.next = 11;
            break;

          case 6:
            _context9.next = 8;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 8:
            user = _context9.sent;
            user.point += +addPoint;
            user.save(function (err) {
              if (err) {
                res.json({
                  result: "fail",
                  message: "충전 실패"
                });
              } else {
                res.json({
                  result: "success",
                  message: "충전 완료"
                });
              }
            });

          case 11:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function chargePoint(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var deleteReservation = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var _id, reservation, user, sharedlocation;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (!req.decoded) {
              res.json({
                result: "fail",
                message: "잘못된 접근입니다"
              });
            }

            _id = req.body._id;
            _context10.next = 4;
            return _Reservation["default"].findOne({
              _id: _id
            });

          case 4:
            reservation = _context10.sent;
            _context10.next = 7;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 7:
            user = _context10.sent;
            user.reservation.pull(_id); //결제금액

            user.point += reservation.sum;
            user.save(function (err) {
              return console.log(err);
            });
            _context10.next = 13;
            return _SharedLocation["default"].findOne({
              _id: reservation.location
            });

          case 13:
            sharedlocation = _context10.sent;
            sharedlocation.reservationList.pull(_id);
            sharedlocation.save(function (err) {
              if (err) console.log(err);
            });
            _context10.next = 18;
            return _Reservation["default"].findByIdAndDelete({
              _id: _id
            }, function (err) {
              if (err) res.json({
                result: "fail",
                message: "삭제 실패"
              });else {
                res.json({
                  result: "success",
                  message: "삭제 완료"
                });
              }
            });

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function deleteReservation(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var postVisitPurpose = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var _req$body4, _id, category, description, reservation, purpose, user;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.log(req);
            _req$body4 = req.body, _id = _req$body4._id, category = _req$body4.category, description = _req$body4.description;
            _context11.prev = 2;
            _context11.next = 5;
            return _Reservation["default"].findOne({
              _id: _id
            }).select("purpose location sum");

          case 5:
            reservation = _context11.sent;
            _context11.next = 8;
            return (0, _VisitPurpose["default"])({
              category: category,
              description: description
            });

          case 8:
            purpose = _context11.sent;

            if (!(reservation.purpose == 1)) {
              _context11.next = 13;
              break;
            }

            res.json({
              result: "fail",
              message: "이미 리뷰하신 예약입니다."
            });
            _context11.next = 28;
            break;

          case 13:
            reservation.purpose = 1;
            purpose.location = reservation.location;

            if (!req.decoded) {
              _context11.next = 23;
              break;
            }

            _context11.next = 18;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 18:
            user = _context11.sent;
            purpose.user = user._id;
            user.point += +reservation.sum / 20;
            _context11.next = 23;
            return user.save();

          case 23:
            _context11.next = 25;
            return _VisitPurpose["default"].create(purpose);

          case 25:
            _context11.next = 27;
            return reservation.save();

          case 27:
            res.json({
              result: "success",
              message: "방문 목적을 적어주셔서 감사합니다."
            });

          case 28:
            _context11.next = 34;
            break;

          case 30:
            _context11.prev = 30;
            _context11.t0 = _context11["catch"](2);
            console.log(_context11.t0);
            res.json({
              result: "fail",
              message: "DB저장 오류"
            });

          case 34:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[2, 30]]);
  }));

  return function postVisitPurpose(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

var notUserReservation = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var phoneNumber, reservationList, data;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            phoneNumber = req.body.phoneNumber;
            _context12.prev = 1;
            _context12.next = 4;
            return _Reservation["default"].find({
              notUserPhoneNumber: phoneNumber
            }).select("_id location carNumber notUserPhoneNumber notUserName startTime endTime sum location").populate({
              path: "location",
              select: "parkingInfo"
            });

          case 4:
            reservationList = _context12.sent;
            data = reservationList.filter(function (e) {
              return new Date(e.startTime).getTime() >= new Date().getTime();
            });
            if (data.length == 0) res.json({
              result: "fail",
              message: "해당하는 예약이 없습니다"
            });else res.json({
              result: "success",
              data: data
            });
            _context12.next = 13;
            break;

          case 9:
            _context12.prev = 9;
            _context12.t0 = _context12["catch"](1);
            console.log(_context12.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 9]]);
  }));

  return function notUserReservation(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

var mySharedResrvations = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var user, sharedLocation, data, _iterator2, _step2, e, reservationData, reservation;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (req.decoded) {
              _context13.next = 4;
              break;
            }

            res.status(403).json({
              result: "fail",
              message: "잘못된 접근입니다"
            });
            _context13.next = 53;
            break;

          case 4:
            _context13.prev = 4;
            _context13.next = 7;
            return _User["default"].findOne({
              _id: req.decoded._id
            });

          case 7:
            user = _context13.sent;

            if (!user.sharingParkingLot) {
              _context13.next = 46;
              break;
            }

            _context13.next = 11;
            return _SharedLocation["default"].findOne({
              _id: user.sharingParkingLot
            }).populate({
              path: "reservationList",
              select: "_id startTime endTime carNumber notUserPhoneNumber"
            });

          case 11:
            sharedLocation = _context13.sent;
            sharedLocation.reservationList.sort(function (a, b) {
              return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });
            data = [];
            _iterator2 = _createForOfIteratorHelper(sharedLocation.reservationList);
            _context13.prev = 15;

            _iterator2.s();

          case 17:
            if ((_step2 = _iterator2.n()).done) {
              _context13.next = 35;
              break;
            }

            e = _step2.value;
            console.log(new Date(e.startTime).getTime());
            reservationData = {};
            reservationData.startTime = e.startTime;
            reservationData.endTime = e.endTime;
            reservationData.carNumber = e.carNumber;

            if (e.notUserPhoneNumber) {
              _context13.next = 31;
              break;
            }

            _context13.next = 27;
            return _Reservation["default"].findOne({
              _id: e._id
            }).populate({
              path: "client",
              select: "userPhone"
            });

          case 27:
            reservation = _context13.sent;
            reservationData.phoneNumber = reservation.client.userPhone;
            _context13.next = 32;
            break;

          case 31:
            reservationData.phoneNumber = e.notUserPhoneNumber;

          case 32:
            data.push(reservationData);

          case 33:
            _context13.next = 17;
            break;

          case 35:
            _context13.next = 40;
            break;

          case 37:
            _context13.prev = 37;
            _context13.t0 = _context13["catch"](15);

            _iterator2.e(_context13.t0);

          case 40:
            _context13.prev = 40;

            _iterator2.f();

            return _context13.finish(40);

          case 43:
            res.json({
              result: "success",
              data: data
            });
            _context13.next = 47;
            break;

          case 46:
            res.json({
              result: "fail",
              message: "공유를 먼저해주세요"
            });

          case 47:
            _context13.next = 53;
            break;

          case 49:
            _context13.prev = 49;
            _context13.t1 = _context13["catch"](4);
            console.log(_context13.t1);
            res.josn({
              result: "fail",
              message: "db 오류"
            });

          case 53:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[4, 49], [15, 37, 40, 43]]);
  }));

  return function mySharedResrvations(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

userRouter.post("/getSharedImage", sendImagePath);
userRouter.post("/login", postLogin);
userRouter.get("/join", getJoin);
userRouter.post("/join", postJoin);
userRouter.post("/editPassword", changePassword);
userRouter.post("/myReservation", myReservationList);
userRouter.post("/notUser/reservation", notUserReservation);
userRouter.post("/carEnroll", userCarEnroll);
userRouter.post("/carDelete", userCarDelete);
userRouter.post("/chargePoint", chargePoint);
userRouter.post("/deleteReservation", deleteReservation);
userRouter.post("/visitPurpose", postVisitPurpose);
userRouter.post("/mySharingParkingLot", mySharedResrvations);
var _default = userRouter;
exports["default"] = _default;