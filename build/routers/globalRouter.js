"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _userRouter = _interopRequireDefault(require("./userRouter"));

var _User = _interopRequireDefault(require("../models/User"));

var _SharedLocation = _interopRequireDefault(require("../models/SharedLocation"));

var _Image = _interopRequireDefault(require("../models/Image"));

var _VisitPurpose = _interopRequireDefault(require("../models/VisitPurpose"));

var _multerMiddleware = require("../multerMiddleware");

var _fs = _interopRequireWildcard(require("fs"));

var _Notice = _interopRequireDefault(require("../models/Notice"));

var _path = _interopRequireDefault(require("path"));

var _util = require("util");

var _jwtMiddleware = require("../jwtMiddleware");

var globalRouter = _express["default"].Router();

var getHome = function getHome(req, res) {
  res.send("주차장 예약 시스템에 오신 것을 환영합니다!");
};

var getAllusers = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var user, allUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log(req.decoded);
            _context.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 4:
            user = _context.sent;

            if (!(user.state != 1)) {
              _context.next = 9;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근 입니다."
            });
            _context.next = 13;
            break;

          case 9:
            _context.next = 11;
            return _User["default"].find();

          case 11:
            allUser = _context.sent;
            res.json({
              result: "success",
              users: allUser
            });

          case 13:
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function getAllusers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var uploadTest = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var image;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.decoded) {
              _context2.next = 5;
              break;
            }

            res.json({
              result: "fail",
              message: "비정상적인 접근"
            });

            _fs["default"].unlink(_path["default"].join(__dirname, "../../uploads/images/".concat(req.file.filename)), function (err) {
              if (err) throw err;
              console.log("잘못된 접근으로 만들어진", req.file.filename, "을 지웠습니다");
            });

            _context2.next = 24;
            break;

          case 5:
            if (req.file) {
              _context2.next = 9;
              break;
            }

            res.json({
              result: "fail",
              message: "이미지 오류"
            });
            _context2.next = 24;
            break;

          case 9:
            console.log(req);
            console.log(req.file);
            _context2.next = 13;
            return (0, _Image["default"])({
              owner: req.decoded._id,
              fileName: req.file.filename,
              filePath: req.file.path
            });

          case 13:
            image = _context2.sent;
            _context2.prev = 14;
            _context2.next = 17;
            return _Image["default"].create(image);

          case 17:
            res.json({
              result: "success",
              message: "성공적으로 이미지를 업로드 하였습니다."
            });
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](14);
            console.log(_context2.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[14, 20]]);
  }));

  return function uploadTest(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var checkSharedLocation = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var admin, _req$body, _id, userId, owner, location;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 2:
            admin = _context3.sent;

            if (!(admin.state != 1)) {
              _context3.next = 7;
              break;
            }

            res.json({
              registerLocationResult: "fail",
              message: "잘못된 접근입니다."
            });
            _context3.next = 23;
            break;

          case 7:
            _req$body = req.body, _id = _req$body._id, userId = _req$body.userId;
            console.log(req);
            _context3.next = 11;
            return _User["default"].findOne({
              userId: userId
            });

          case 11:
            owner = _context3.sent;

            if (!owner.sharingParkingLot) {
              _context3.next = 16;
              break;
            }

            res.json({
              registerLocationResult: "fail",
              message: "등록된 주차장이 있습니다."
            });
            _context3.next = 23;
            break;

          case 16:
            owner.sharingParkingLot = _id;
            owner.save(function (err) {
              if (err) res.json({
                registerLocationResult: "fail",
                message: "배정자 등록 실패"
              });
            });
            _context3.next = 20;
            return _SharedLocation["default"].findOne({
              _id: _id
            });

          case 20:
            location = _context3.sent;
            location.state = 1;
            location.save(function (err) {
              if (err) res.json({
                registerLocationResult: "fail",
                message: "db 저장 실패"
              });else {
                res.json({
                  registerLocationResult: "success",
                  message: "배정자 등록 완료"
                });
              }
            });

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function checkSharedLocation(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var unCheckedSharedLocation = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var admin, unCheckedList;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 2:
            admin = _context4.sent;

            if (!(admin.state != 1)) {
              _context4.next = 7;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다."
            });
            _context4.next = 12;
            break;

          case 7:
            _context4.next = 9;
            return _SharedLocation["default"].find({
              state: 0
            }).select("userCarNumber userBirth location latitude longitude filePath parkingInfo enrollTime state").populate({
              path: "owner",
              select: "userId userName userPhone userCarNumber"
            });

          case 9:
            unCheckedList = _context4.sent;
            res.json({
              data: unCheckedList
            });
            console.log(unCheckedList);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function unCheckedSharedLocation(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var adminEditPassword = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$body2, editPassword, userId, user, clickedUser;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(req);
            _req$body2 = req.body, editPassword = _req$body2.editPassword, userId = _req$body2.userId; //관리자 검증

            _context5.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 4:
            user = _context5.sent;
            console.log(user);

            if (!(user.state != 1)) {
              _context5.next = 10;
              break;
            }

            res.json({
              editPasswordResult: "fail",
              message: "잘못된 접근입니다"
            });
            _context5.next = 16;
            break;

          case 10:
            _context5.next = 12;
            return _User["default"].findOne({
              userId: userId
            });

          case 12:
            clickedUser = _context5.sent;
            clickedUser.userPassword = editPassword;
            _context5.next = 16;
            return clickedUser.save(function (err) {
              if (err) res.json({
                editPasswordResult: "fail",
                message: "db 저장 실패"
              });else {
                res.json({
                  editPasswordResult: "success",
                  message: "관리자가 비밀번호 변경 성공"
                });
              }
            });

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function adminEditPassword(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); //공지사항


var allNotice = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var notices;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log(req);
            _context6.next = 3;
            return _Notice["default"].find();

          case 3:
            notices = _context6.sent;
            res.json({
              data: notices
            });

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function allNotice(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var adminNotice = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var notices;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _Notice["default"].find();

          case 2:
            notices = _context7.sent;
            res.json({
              data: notices
            });

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function adminNotice(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var adminEditState = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _req$body3, editState, userId, user, clickedUser;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$body3 = req.body, editState = _req$body3.editState, userId = _req$body3.userId; //관리자 검증

            _context8.next = 3;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 3:
            user = _context8.sent;
            console.log(user);

            if (!(user.state != 1)) {
              _context8.next = 9;
              break;
            }

            res.json({
              editStateResult: "fail",
              message: "잘못된 접근입니다"
            });
            _context8.next = 15;
            break;

          case 9:
            _context8.next = 11;
            return _User["default"].findOne({
              userId: userId
            });

          case 11:
            clickedUser = _context8.sent;
            clickedUser.state = editState;
            _context8.next = 15;
            return clickedUser.save(function (err) {
              if (err) res.json({
                editStateResult: "fail",
                message: "db 저장 실패"
              });else {
                console.log(clickedUser);
                res.json({
                  editStateResult: "success",
                  message: "관리자가 권한 변경 성공"
                });
              }
            });

          case 15:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function adminEditState(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var adminEditPhone = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var _req$body4, editPhone, userId, user, clickedUser;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _req$body4 = req.body, editPhone = _req$body4.editPhone, userId = _req$body4.userId; //관리자 검증

            _context9.next = 3;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 3:
            user = _context9.sent;

            if (!(user.state != 1)) {
              _context9.next = 8;
              break;
            }

            res.json({
              editPhoneResult: "fail",
              message: "잘못된 접근입니다"
            });
            _context9.next = 14;
            break;

          case 8:
            _context9.next = 10;
            return _User["default"].findOne({
              userId: userId
            });

          case 10:
            clickedUser = _context9.sent;
            clickedUser.userPhone = editPhone;
            _context9.next = 14;
            return clickedUser.save(function (err) {
              if (err) res.json({
                editPhoneResult: "fail",
                message: "db 저장 실패"
              });else {
                console.log(clickedUser);
                res.json({
                  editPhoneResult: "success",
                  message: "관리자가 핸드폰 정보 성공"
                });
              }
            });

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function adminEditPhone(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var adminEditPoint = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var _req$body5, editPoint, userId, user, clickedUser;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _req$body5 = req.body, editPoint = _req$body5.editPoint, userId = _req$body5.userId; //관리자 검증

            _context10.next = 3;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 3:
            user = _context10.sent;

            if (!(user.state != 1)) {
              _context10.next = 8;
              break;
            }

            res.json({
              editPointResult: "fail",
              message: "잘못된 접근입니다"
            });
            _context10.next = 20;
            break;

          case 8:
            _context10.prev = 8;
            _context10.next = 11;
            return _User["default"].findOne({
              userId: userId
            });

          case 11:
            clickedUser = _context10.sent;
            clickedUser.point = editPoint;
            console.log(clickedUser);
            clickedUser.save(function (err) {
              if (err) {
                console.log(err);
                res.json({
                  editPointResult: "fail",
                  message: "db 저장 실패"
                });
              } else {
                console.log(clickedUser);
                res.json({
                  editPointResult: "success",
                  message: "관리자가 포인트 추가/감소"
                });
              }
            });
            _context10.next = 20;
            break;

          case 17:
            _context10.prev = 17;
            _context10.t0 = _context10["catch"](8);
            res.json({
              result: "fail",
              message: "db 에러"
            });

          case 20:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[8, 17]]);
  }));

  return function adminEditPoint(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var adminGetStatistics = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var purposes, data, subData, dataCount, _i, _data, i;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return _VisitPurpose["default"].find();

          case 3:
            purposes = _context11.sent;
            data = ["외식", "쇼핑", "출장", "친구", "의료", "여행", "기타"];
            subData = [];
            dataCount = [];

            for (_i = 0, _data = data; _i < _data.length; _i++) {
              i = _data[_i];
              subData = purposes.filter(function (e) {
                return e.category.indexOf(i) != -1;
              });
              console.log(subData.length);
              dataCount.push(subData.length);
            }

            res.json({
              data: dataCount
            });
            _context11.next = 15;
            break;

          case 11:
            _context11.prev = 11;
            _context11.t0 = _context11["catch"](0);
            console.log(_context11.t0);
            res.json({
              result: "fail",
              message: "db오류"
            });

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 11]]);
  }));

  return function adminGetStatistics(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

var adminDeleteNotice = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var _id, user;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _id = req.body._id;
            _context12.prev = 1;
            _context12.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 4:
            user = _context12.sent;

            if (!(user.state != 1)) {
              _context12.next = 9;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다"
            });
            _context12.next = 11;
            break;

          case 9:
            _context12.next = 11;
            return _Notice["default"].findByIdAndDelete(_id, function (err) {
              if (!err) {
                res.json({
                  result: "success",
                  message: "삭제 완료"
                });
              }
            });

          case 11:
            _context12.next = 17;
            break;

          case 13:
            _context12.prev = 13;
            _context12.t0 = _context12["catch"](1);
            console.log(_context12.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 17:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 13]]);
  }));

  return function adminDeleteNotice(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

var adminUpdateNotice = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var _req$body6, _id, title, context, user;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _req$body6 = req.body, _id = _req$body6._id, title = _req$body6.title, context = _req$body6.context;
            _context13.prev = 1;
            _context13.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 4:
            user = _context13.sent;

            if (!(user.state != 1)) {
              _context13.next = 9;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다"
            });
            _context13.next = 11;
            break;

          case 9:
            _context13.next = 11;
            return _Notice["default"].findByIdAndUpdate(_id, {
              $set: {
                title: title,
                description: context
              }
            }, function (err) {
              if (!err) {
                res.json({
                  result: "success",
                  message: "삭제 완료"
                });
              }
            });

          case 11:
            _context13.next = 17;
            break;

          case 13:
            _context13.prev = 13;
            _context13.t0 = _context13["catch"](1);
            console.log(_context13.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 17:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[1, 13]]);
  }));

  return function adminUpdateNotice(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

var adminAddNotice = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var _req$body7, title, context, user, notice;

    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _req$body7 = req.body, title = _req$body7.title, context = _req$body7.context;
            _context14.prev = 1;
            _context14.next = 4;
            return _User["default"].findOne({
              userId: req.decoded.userId
            });

          case 4:
            user = _context14.sent;

            if (!(user.state != 1)) {
              _context14.next = 9;
              break;
            }

            res.json({
              result: "fail",
              message: "잘못된 접근입니다"
            });
            _context14.next = 15;
            break;

          case 9:
            _context14.next = 11;
            return (0, _Notice["default"])({
              title: title,
              description: context
            });

          case 11:
            notice = _context14.sent;
            _context14.next = 14;
            return _Notice["default"].create(notice);

          case 14:
            res.json({
              result: "success",
              message: "공지사항 등록 완료"
            });

          case 15:
            _context14.next = 21;
            break;

          case 17:
            _context14.prev = 17;
            _context14.t0 = _context14["catch"](1);
            console.log(_context14.t0);
            res.json({
              result: "fail",
              message: "DB 오류"
            });

          case 21:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[1, 17]]);
  }));

  return function adminAddNotice(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();

globalRouter.get("/", getHome);
globalRouter.get("/upload", function (req, res) {
  res.render("uploadTest");
});
globalRouter.get("/notices", allNotice);
globalRouter.post("/upload", _multerMiddleware.uploadImage, uploadTest);
globalRouter.post("/admin/notices", adminNotice);
globalRouter.post("/admin/users", _jwtMiddleware.adminCheck, getAllusers);
globalRouter.post("/admin/sharedLocation/enroll", _jwtMiddleware.adminCheck, checkSharedLocation);
globalRouter.post("/admin/unCheckedList", _jwtMiddleware.adminCheck, unCheckedSharedLocation);
globalRouter.post("/admin/editPassword", _jwtMiddleware.adminCheck, adminEditPassword);
globalRouter.post("/admin/editPhone", _jwtMiddleware.adminCheck, adminEditPhone);
globalRouter.post("/admin/editPoint", _jwtMiddleware.adminCheck, adminEditPoint);
globalRouter.post("/admin/editState", _jwtMiddleware.adminCheck, adminEditState);
globalRouter.post("/admin/statistics", _jwtMiddleware.adminCheck, adminGetStatistics);
globalRouter.post("/admin/deleteNotice", _jwtMiddleware.adminCheck, adminDeleteNotice);
globalRouter.post("/admin/reviseNotice", _jwtMiddleware.adminCheck, adminUpdateNotice);
globalRouter.post("/admin/addNotice", _jwtMiddleware.adminCheck, adminAddNotice);
var _default = globalRouter;
exports["default"] = _default;