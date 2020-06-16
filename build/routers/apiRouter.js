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

var _SharedLocation = _interopRequireDefault(require("../models/SharedLocation"));

var _userRouter = _interopRequireDefault(require("./userRouter"));

var _Reservation = _interopRequireDefault(require("../models/Reservation"));

var _multerMiddleware = require("../multerMiddleware");

var _moment = _interopRequireDefault(require("moment"));

require("moment-timezone");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _dateController = require("../controllers/dateController");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var apiRouter = _express["default"].Router();

var getUserInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var checkUser, user, todaySharingState, _user;

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
            _context.next = 38;
            break;

          case 4:
            _context.prev = 4;
            _context.next = 7;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 7:
            checkUser = _context.sent;

            if (!(checkUser != null)) {
              _context.next = 31;
              break;
            }

            if (!(checkUser.sharingParkingLot != null)) {
              _context.next = 19;
              break;
            }

            _context.next = 12;
            return _User["default"].findOne({
              userId: req.decoded.userId
            }).select("userId userName userEmail userPhone userCarNumber point state").populate({
              path: "sharingParkingLot",
              select: "latitude longitude state timeState"
            });

          case 12:
            user = _context.sent;
            _context.next = 15;
            return user.sharingParkingLot.timeState[(0, _dateController.changeDay)((0, _moment["default"])().format("ddd"))];

          case 15:
            todaySharingState = _context.sent;
            res.json({
              result: "success",
              user: user,
              todaySharingState: todaySharingState
            });
            _context.next = 29;
            break;

          case 19:
            _context.prev = 19;
            _context.next = 22;
            return _User["default"].findOne({
              userId: req.decoded.userId
            }).select("userId userName userEmail userPhone userCarNumber point state");

          case 22:
            _user = _context.sent;
            res.json({
              result: "success",
              user: _user
            });
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](19);
            console.log(_context.t0);

          case 29:
            _context.next = 32;
            break;

          case 31:
            res.json({
              result: "fail",
              message: "db에서 지워진 사용자입니다"
            });

          case 32:
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t1 = _context["catch"](4);
            console.log(_context.t1);
            res.status(403).json({
              result: "fail",
              message: "db 오류"
            });

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 34], [19, 26]]);
  }));

  return function getUserInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getUserInfo = getUserInfo;

var sharedLocationEnroll = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, userBirth, userCarNumber, location, latitude, longitude, parkingInfo, user, sharedLocation;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("배정자 등록 요청", req);
            _req$body = req.body, userBirth = _req$body.userBirth, userCarNumber = _req$body.userCarNumber, location = _req$body.location, latitude = _req$body.latitude, longitude = _req$body.longitude, parkingInfo = _req$body.parkingInfo;

            if (req.file) {
              _context2.next = 6;
              break;
            }

            res.json({
              result: "fail",
              message: "이미지 파일이 정상적으로 업로드 되지 않았습니다."
            });
            _context2.next = 32;
            break;

          case 6:
            if (req.decoded) {
              _context2.next = 11;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다"
            });

            _fs["default"].unlink(_path["default"].join(__dirname, "../../uploads/images/".concat(req.file.filename)), function (err) {
              if (err) throw err;
              console.log("잘못된 접근으로 만들어진", req.file.filename, "을 지웠습니다");
            });

            _context2.next = 32;
            break;

          case 11:
            _context2.next = 13;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 13:
            user = _context2.sent;

            if (!user.sharingParkingLot) {
              _context2.next = 18;
              break;
            }

            res.json({
              result: "fail",
              message: "등록된 공유 주차장이 있습니다."
            });
            _context2.next = 32;
            break;

          case 18:
            _context2.prev = 18;
            _context2.next = 21;
            return (0, _SharedLocation["default"])({
              owner: req.decoded._id,
              filePath: req.file.path,
              userCarNumber: userCarNumber,
              userBirth: userBirth,
              location: location,
              latitude: latitude,
              longitude: longitude,
              parkingInfo: parkingInfo,
              timeState: [0, 0, 0, 0, 0, 0, 0]
            });

          case 21:
            sharedLocation = _context2.sent;
            _context2.next = 24;
            return _SharedLocation["default"].create(sharedLocation);

          case 24:
            console.log("배정자 등록 신청이 완료 되었습니다.");
            res.json({
              result: "success",
              message: "배정자 등록 신청이 완료되었습니다."
            });
            _context2.next = 32;
            break;

          case 28:
            _context2.prev = 28;
            _context2.t0 = _context2["catch"](18);
            console.log(_context2.t0);
            res.json({
              result: "fail",
              message: "배정자 등록 신청 실패"
            });

          case 32:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[18, 28]]);
  }));

  return function sharedLocationEnroll(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var reservationEnroll = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body2, _id, carNumber, startTime, endTime, point, sum, reservation, user, sharedLocation, moneyResult, sharedResult, result, _iterator, _step, e, createdReservation;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log(req);
            _req$body2 = req.body, _id = _req$body2._id, carNumber = _req$body2.carNumber, startTime = _req$body2.startTime, endTime = _req$body2.endTime, point = _req$body2.point, sum = _req$body2.sum;

            if (req.decoded) {
              _context3.next = 6;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context3.next = 56;
            break;

          case 6:
            _context3.prev = 6;
            _context3.next = 9;
            return (0, _Reservation["default"])({
              client: req.decoded._id,
              location: _id,
              carNumber: carNumber,
              startTime: startTime,
              endTime: endTime,
              sum: sum
            });

          case 9:
            reservation = _context3.sent;
            _context3.next = 12;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 12:
            user = _context3.sent;
            _context3.next = 15;
            return _SharedLocation["default"].findOne({
              _id: _id
            }).populate({
              path: "reservationList",
              select: "startTime endTime"
            });

          case 15:
            sharedLocation = _context3.sent;
            moneyResult = true;
            sharedResult = true;
            result = true;
            if (user.point < +point) moneyResult = false;
            if (sharedLocation.timeState[(0, _dateController.changeDay)(startTime.slice(0, 3))] == 0 && sharedLocation.timeState[(0, _dateController.changeDay)(endTime.slice(0, 3))] == 0) sharedResult = false;
            _iterator = _createForOfIteratorHelper(sharedLocation.reservationList);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                e = _step.value;
                console.log(e, "결과" + result);
                if (new Date(e.startTime).getTime() < new Date(reservation.endTime).getTime() && new Date(reservation.endTime).getTime() < new Date(e.endTime).getTime()) result = false;else if (new Date(e.startTime).getTime() < new Date(reservation.startTime).getTime() && new Date(reservation.startTime).getTime() < new Date(e.endTime).getTime()) result = false;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            if (!(sharedResult == false)) {
              _context3.next = 27;
              break;
            }

            res.json({
              result: "fail",
              message: "해당 주차장은 오늘 공유가 종료되었습니다."
            });
            _context3.next = 50;
            break;

          case 27:
            if (!(moneyResult == false)) {
              _context3.next = 31;
              break;
            }

            res.json({
              result: "fail",
              message: "포인트가 부족합니다."
            });
            _context3.next = 50;
            break;

          case 31:
            if (!((0, _dateController.possibleTimeCheck)(sharedLocation.possibleStartTime, sharedLocation.possibleEndTime, reservation.startTime, reservation.endTime) == false)) {
              _context3.next = 35;
              break;
            }

            res.json({
              result: "fail",
              message: "가능한 시간대가 아닙니다."
            });
            _context3.next = 50;
            break;

          case 35:
            if (!(result == false)) {
              _context3.next = 39;
              break;
            }

            res.json({
              result: "fail",
              message: "해당 시간은 예약이 되어 있습니다."
            });
            _context3.next = 50;
            break;

          case 39:
            _context3.next = 41;
            return _Reservation["default"].create(reservation);

          case 41:
            createdReservation = _context3.sent;
            user.point -= +point;
            user.reservation.push(createdReservation._id);
            user.save(function (err) {
              if (err) {
                console.log(err);
                res.json({
                  result: "fail",
                  message: "사용자 예약 등록 실패"
                });
              }
            });
            createdReservation.owner = sharedLocation.owner;
            createdReservation.save(function (err) {
              if (err) {
                res.json({
                  result: "fail",
                  message: "예약에 소유자 등록 실패"
                });
              }
            });
            sharedLocation.reservationList.push(createdReservation._id);
            sharedLocation.save(function (err) {
              if (err) res.json({
                result: "fail",
                message: "배정지 예약 리스트 등록 실패"
              });
            });
            res.json({
              result: "success",
              message: "예약 완료 되었습니다."
            });

          case 50:
            _context3.next = 56;
            break;

          case 52:
            _context3.prev = 52;
            _context3.t0 = _context3["catch"](6);
            console.log(_context3.t0);
            res.json({
              result: "fail",
              message: "사용자 등록 DB ERROR"
            });

          case 56:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 52]]);
  }));

  return function reservationEnroll(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var allSharedLocation = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var allSharedLocations;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(req.headers["x-forwarded-for"], req.connection.remoteAddress);
            _context4.prev = 1;
            _context4.next = 4;
            return _SharedLocation["default"].find({
              state: 1
            }).select("location latitude longitude parkingInfo timeState").populate({
              path: "owner",
              select: "userId userPhone"
            });

          case 4:
            allSharedLocations = _context4.sent;
            res.json({
              result: "success",
              data: allSharedLocations
            });
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            res.json({
              result: "fail",
              message: "db 에러"
            });

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 8]]);
  }));

  return function allSharedLocation(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getAddress = function getAddress(req, res) {
  res.render("getAddress");
};

var sharedLocationReserveList = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var locationId, reserveList, data, _iterator2, _step2, e;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            locationId = req.query.locationId;
            _context5.next = 3;
            return _SharedLocation["default"].findOne({
              _id: locationId
            }).select("reservationList possibleStartTime possibleEndTime timeState").populate({
              path: "reservationList",
              select: "startTime endTime"
            });

          case 3:
            reserveList = _context5.sent;
            data = [];
            _iterator2 = _createForOfIteratorHelper(reserveList.reservationList);

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                e = _step2.value;

                if ((0, _dateController.changeMonth)(e.startTime.slice(4, 7)) === (0, _moment["default"])().format("MM")) {
                  if (+e.startTime.slice(8, 10) == +(0, _moment["default"])().format("DD") + 1 || +e.startTime.slice(8, 10) == +(0, _moment["default"])().format("DD")) {
                    data.push(e);
                  }
                } else if (+(0, _dateController.changeMonth)(e.startTime.slice(4, 7)) - +(0, _moment["default"])().format("MM") == 1) {
                  if (+(0, _moment["default"])().format("DD") >= 30) {
                    if (+e.startTime.slice(8, 10) == 1) {
                      data.push(e);
                    }
                  }
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            res.json({
              reservationList: data
            });

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function sharedLocationReserveList(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var shareInfo = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (req.decoded) {
              _context6.next = 4;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context6.next = 15;
            break;

          case 4:
            _context6.prev = 4;
            _context6.next = 7;
            return _User["default"].findOne({
              userId: req.decoded.userId
            }).populate({
              path: "sharingParkingLot",
              select: "timeState possibleStartTime possibleEndTime"
            });

          case 7:
            user = _context6.sent;

            if (!user.sharingParkingLot) {
              res.json({
                result: "fail",
                message: "주차장을 먼저 공유하세요."
              });
            } else {
              res.json({
                result: "success",
                message: "공유 시간 정보 확인",
                startTime: user.sharingParkingLot.possibleStartTime,
                endTime: user.sharingParkingLot.possibleEndTime,
                Sun: user.sharingParkingLot.timeState[0],
                Mon: user.sharingParkingLot.timeState[1],
                Tue: user.sharingParkingLot.timeState[2],
                Wed: user.sharingParkingLot.timeState[3],
                Thu: user.sharingParkingLot.timeState[4],
                Fri: user.sharingParkingLot.timeState[5],
                Sat: user.sharingParkingLot.timeState[6]
              });
            }

            _context6.next = 15;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](4);
            res.json({
              result: "fail",
              message: "db 오류"
            });
            console.log(_context6.t0);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 11]]);
  }));

  return function shareInfo(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var updateShareInfo = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var _req$body3, startTime, endTime, days, user, sharedLocationID, sharedLocation;

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
            _context7.next = 27;
            break;

          case 4:
            _req$body3 = req.body, startTime = _req$body3.startTime, endTime = _req$body3.endTime, days = _req$body3.days;
            _context7.prev = 5;
            _context7.next = 8;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 8:
            user = _context7.sent;
            sharedLocationID = user.sharingParkingLot;

            if (user.sharingParkingLot) {
              _context7.next = 14;
              break;
            }

            res.json({
              result: "fail",
              message: "주차장을 먼저 공유하세요."
            });
            _context7.next = 21;
            break;

          case 14:
            _context7.next = 16;
            return _SharedLocation["default"].findOne({
              _id: sharedLocationID
            });

          case 16:
            sharedLocation = _context7.sent;
            sharedLocation.possibleEndTime = endTime;
            sharedLocation.possibleStartTime = startTime;
            sharedLocation.timeState = JSON.parse(days);
            sharedLocation.save(function (err) {
              if (err) res.json({
                result: "fail",
                message: "공유시간 수정 실패"
              });else res.json({
                result: "success",
                message: "공유시간 수정 성공"
              });
            });

          case 21:
            _context7.next = 27;
            break;

          case 23:
            _context7.prev = 23;
            _context7.t0 = _context7["catch"](5);
            console.log(_context7.t0);
            res.json({
              result: "fail",
              message: "db 오류"
            });

          case 27:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[5, 23]]);
  }));

  return function updateShareInfo(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var sharingSwitch = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var turn, user, location, todayIndex;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            turn = req.body.turn;

            if (req.decoded) {
              _context8.next = 5;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context8.next = 25;
            break;

          case 5:
            _context8.prev = 5;
            _context8.next = 8;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 8:
            user = _context8.sent;

            if (user.sharingParkingLot) {
              _context8.next = 13;
              break;
            }

            res.json({
              result: "fail",
              message: "주차장을 먼저 공유하세요."
            });
            _context8.next = 20;
            break;

          case 13:
            _context8.next = 15;
            return _SharedLocation["default"].findOne({
              _id: user.sharingParkingLot
            });

          case 15:
            location = _context8.sent;
            todayIndex = (0, _dateController.changeDay)((0, _moment["default"])().format("ddd"));
            console.log(location.timeState);

            if (turn == 1) {
              location.timeState.set(todayIndex, 1);
            } else if (turn == 0) {
              location.timeState.set(todayIndex, 0);
            }

            location.save(function (err) {
              if (err) {} else {
                console.log(location.timeState);
                res.json({
                  result: "success",
                  message: "공유 On/Off"
                });
              }
            });

          case 20:
            _context8.next = 25;
            break;

          case 22:
            _context8.prev = 22;
            _context8.t0 = _context8["catch"](5);
            console.log(_context8.t0);

          case 25:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[5, 22]]);
  }));

  return function sharingSwitch(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var locationInfo = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var locationId, locationInfo;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            locationId = req.query.locationId;
            _context9.next = 3;
            return _SharedLocation["default"].findOne({
              _id: locationId
            }).select("possibleStartTime possibleEndTime timeState");

          case 3:
            locationInfo = _context9.sent;
            res.json({
              locationInfo: locationInfo
            });

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function locationInfo(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

apiRouter.post("/auth", getUserInfo);
apiRouter.post("/sharedLocation/enroll", _multerMiddleware.uploadImage, sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/allSharedLocation", allSharedLocation);
apiRouter.get("/reserveList", sharedLocationReserveList);
apiRouter.get("/getAddress", getAddress);
apiRouter.get("/locationInfo", locationInfo);
apiRouter.post("/shareInfo", shareInfo);
apiRouter.post("/sharingSwitch", sharingSwitch);
apiRouter.post("/sendShareInfo", updateShareInfo);
var _default = apiRouter;
exports["default"] = _default;