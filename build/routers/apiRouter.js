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

var apiRouter = _express["default"].Router(); // const findUser = function (userName) {
//   return database.users.filter((x) => x.name === userName);
// };


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
    var _req$body, latitude, longitude, price, user, sharedLocation;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("배정자 등록 요청", req);
            _req$body = req.body, latitude = _req$body.latitude, longitude = _req$body.longitude, price = _req$body.price;
            _context2.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 4:
            user = _context2.sent;
            console.log("TEST", user.sharingParkingLot);

            if (!user.sharingParkingLot) {
              _context2.next = 10;
              break;
            }

            res.json({
              result: "fail",
              message: "등록된 공유 주차장이 있습니다."
            });
            _context2.next = 25;
            break;

          case 10:
            _context2.prev = 10;
            _context2.next = 13;
            return (0, _SharedLocation["default"])({
              owner: req.decoded._id,
              latitude: latitude,
              longitude: longitude,
              price: price
            });

          case 13:
            sharedLocation = _context2.sent;
            _context2.next = 16;
            return _SharedLocation["default"].create(sharedLocation);

          case 16:
            console.log(sharedLocation);
            user.sharingParkingLot = sharedLocation._id;
            user.save(function (err) {
              if (err) res.json({
                result: "fail",
                message: "db 저장 실패"
              });else {
                res.json({
                  result: "success",
                  message: "배정자 (임시) 등록에 성공하였습니다." //관리자가 승인해주면 등록 안해주면 배정자 삭제 User parkingLot만 관리하면댐

                });
              }
            });
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](10);
            console.log(_context2.t0);
            res.json({
              result: "fail",
              message: "배정자 등록 실패"
            });

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[10, 21]]);
  }));

  return function sharedLocationEnroll(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var reservationEnroll = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body2, startTime, endTime, sum, _reservation, user;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("예약 등록 요청", req);
            _req$body2 = req.body, startTime = _req$body2.startTime, endTime = _req$body2.endTime, sum = _req$body2.sum;

            if (req.decoded) {
              _context3.next = 6;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context3.next = 30;
            break;

          case 6:
            _context3.prev = 6;
            _context3.next = 9;
            return (0, _Reservation["default"])({
              startTime: startTime,
              endTime: endTime,
              sum: sum
            });

          case 9:
            _reservation = _context3.sent;
            _context3.next = 12;
            return _Reservation["default"].create(_reservation);

          case 12:
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](6);
            console.log(_context3.t0);
            res.json({
              result: "fail",
              message: "예약 DB ERROR"
            });

          case 18:
            _context3.prev = 18;
            _context3.next = 21;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 21:
            user = _context3.sent;
            user.reservation.push(reservation);
            user.save(function (err) {
              if (err) {
                console.log(err);
                res.json({
                  result: "fail",
                  message: "사용자 예약 등록 실패"
                });
              } else {
                console.log(reservation);
                res.json({
                  result: "success",
                  message: "사용자 예약 등록 완료"
                });
              }
            });
            _context3.next = 30;
            break;

          case 26:
            _context3.prev = 26;
            _context3.t1 = _context3["catch"](18);
            console.log(_context3.t1);
            res.json({
              result: "fail",
              message: "사용자 등록 DB ERROR"
            });

          case 30:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 14], [18, 26]]);
  }));

  return function reservationEnroll(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var timeParse = function timeParse(time) {
  console.log(time);
};

var getLocation = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var apiURL;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(req);
            apiURL = "https://openapi.naver.com/v1/map/geocode?query=" + req.query;
            console.log(apiURL);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getLocation(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getAddress = function getAddress(req, res) {
  console.log(req);
  res.render("getAddress");
};

apiRouter.post("/auth", getUserInfo);
apiRouter.post("/sharedLocation/enroll", sharedLocationEnroll);
apiRouter.post("/reservation/enroll", reservationEnroll);
apiRouter.post("/car");
apiRouter.get("/getLocation", getLocation);
apiRouter.get("/getAddress", getAddress);
var _default = apiRouter;
exports["default"] = _default;