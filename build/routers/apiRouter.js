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

_moment["default"].tz.setDefault("Asia/Seoul");

var apiRouter = _express["default"].Router();

var getUserInfo = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
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
            _context.next = 7;
            break;

          case 4:
            console.log(req.decoded);
            _context.next = 7;
            return _User["default"].findOne({
              userId: req.decoded.userId
            }).select("userId userName userEmail userPhone userCarNumber point state").populate({
              path: "sharingParkingLot",
              select: "latitude longitude state"
            }).exec(function (err, data) {
              if (err) console.log(err);else {
                if (data) {
                  console.log("토큰 인중 후 ", data);
                  res.json({
                    result: "success",
                    user: data
                  });
                } else {
                  res.json({
                    result: "fail",
                    message: "다시 로그인 해주세요"
                  });
                }
              }
            });

          case 7:
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
            _context2.next = 33;
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
            fs.unlink(path.join(__dirname, "../../uploads/images/".concat(req.file.filename)), function (err) {
              if (err) throw err;
              console.log("잘못된 접근으로 만들어진", req.file.filename, "을 지웠습니다");
            });
            _context2.next = 33;
            break;

          case 11:
            _context2.next = 13;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 13:
            user = _context2.sent;
            console.log("TEST", user.sharingParkingLot);

            if (!user.sharingParkingLot) {
              _context2.next = 19;
              break;
            }

            res.json({
              result: "fail",
              message: "등록된 공유 주차장이 있습니다."
            });
            _context2.next = 33;
            break;

          case 19:
            _context2.prev = 19;
            _context2.next = 22;
            return (0, _SharedLocation["default"])({
              owner: req.decoded._id,
              filePath: req.file.path,
              userCarNumber: userCarNumber,
              userBirth: userBirth,
              location: location,
              latitude: latitude,
              longitude: longitude,
              parkingInfo: parkingInfo,
              // possibleStartTime,
              // possibleEndTime,
              timeState: [0, 0, 0, 0, 0, 0]
            });

          case 22:
            sharedLocation = _context2.sent;
            _context2.next = 25;
            return _SharedLocation["default"].create(sharedLocation);

          case 25:
            console.log("배정자 등록 신청이 완료 되었습니다.");
            res.json({
              result: "success",
              message: "배정자 등록 신청이 완료되었습니다."
            });
            _context2.next = 33;
            break;

          case 29:
            _context2.prev = 29;
            _context2.t0 = _context2["catch"](19);
            console.log(_context2.t0);
            res.json({
              result: "fail",
              message: "배정자 등록 신청 실패"
            });

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[19, 29]]);
  }));

  return function sharedLocationEnroll(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var reservationEnroll = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body2, _id, carNumber, startTime, endTime, reservation, createdReservation, user, sharedLocation;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("예약 등록 요청", req);
            _req$body2 = req.body, _id = _req$body2._id, carNumber = _req$body2.carNumber, startTime = _req$body2.startTime, endTime = _req$body2.endTime;

            if (req.decoded) {
              _context3.next = 6;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context3.next = 32;
            break;

          case 6:
            _context3.prev = 6;
            _context3.next = 9;
            return (0, _Reservation["default"])({
              client: req.decoded._id,
              location: _id,
              carNumber: carNumber,
              startTime: startTime,
              endTime: endTime
            });

          case 9:
            reservation = _context3.sent;
            _context3.next = 12;
            return _Reservation["default"].create(reservation);

          case 12:
            createdReservation = _context3.sent;
            _context3.next = 15;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 15:
            user = _context3.sent;
            user.reservation.push(reservation);
            user.save(function (err) {
              if (err) {
                console.log(err);
                res.json({
                  result: "fail",
                  message: "사용자 예약 등록 실패"
                });
              }
            });
            _context3.next = 20;
            return _SharedLocation["default"].findOne({
              _id: _id
            });

          case 20:
            sharedLocation = _context3.sent;
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
            _context3.next = 32;
            break;

          case 28:
            _context3.prev = 28;
            _context3.t0 = _context3["catch"](6);
            console.log(_context3.t0);
            res.json({
              result: "fail",
              message: "사용자 등록 DB ERROR"
            });

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 28]]);
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
            console.log("\uBAA8\uB4E0 \uB9C8\uCEE4 \uC815\uBCF4 \uC1A1\uC2E0->".concat(req.headers));
            console.log(req.headers["x-forwarded-for"], req.connection.remoteAddress);
            _context4.prev = 2;
            _context4.next = 5;
            return _SharedLocation["default"].find({
              state: 1
            }).select("location latitude longitude parkingInfo").populate({
              path: "owner",
              select: "userId userPhone"
            });

          case 5:
            allSharedLocations = _context4.sent;
            res.json({
              result: "success",
              data: allSharedLocations
            });
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            res.json({
              result: "fail",
              message: "db 에러"
            });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function allSharedLocation(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getAddress = function getAddress(req, res) {
  console.log(req);
  res.render("getAddress");
};

var sharedLocationReserveList = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var locationId, reserveList;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(req);
            locationId = req.query.locationId;
            _context5.next = 4;
            return _SharedLocation["default"].findOne({
              _id: locationId
            }).select("reservationList").populate({
              path: "reservationList",
              select: "startTime endTime"
            });

          case 4:
            reserveList = _context5.sent;
            console.log(reserveList);
            res.json(reserveList);

          case 7:
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

apiRouter.post("/auth", getUserInfo);
apiRouter.post("/sharedLocation/enroll", _multerMiddleware.uploadImage, sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/allSharedLocation", allSharedLocation);
apiRouter.get("/reserveList", sharedLocationReserveList);
apiRouter.get("/getAddress", getAddress);
var _default = apiRouter;
exports["default"] = _default;