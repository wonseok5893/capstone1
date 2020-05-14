"use strict";

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

var _multerMiddleware = require("../multerMiddleware");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

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
    var admin;
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

            if (admin.state != 1) {
              res.json({
                result: "fail",
                message: "잘못된 접근입니다."
              });
            } else {}

          case 4:
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
    var unCheckedList;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _SharedLocation["default"].find({
              state: 0
            });

          case 2:
            unCheckedList = _context4.sent;
            console.log(unCheckedList);

          case 4:
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

globalRouter.get("/", getHome);
globalRouter.get("/upload", function (req, res) {
  res.render("uploadTest");
});
globalRouter.post("/upload", _multerMiddleware.uploadImage, uploadTest);
globalRouter.post("/admin/users", getAllusers);
globalRouter.post("/admin/sharedLocation/enroll", checkSharedLocation);
var _default = globalRouter;
exports["default"] = _default;