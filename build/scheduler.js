"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeSchedule = require("node-schedule");

var _moment = _interopRequireDefault(require("moment"));

require("moment-timezone");

var _SharedLocation = _interopRequireDefault(require("../build/models/SharedLocation"));

var _Reservation = _interopRequireDefault(require("../build/models/Reservation"));

var _User = _interopRequireDefault(require("../build/models/User"));

var _pushAlarm = require("./pushAlarm");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var dbSharedLocation = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var reservations, nowTime, reservationList, endReservationList, deviceTokens, _iterator, _step, e, user, _i, _deviceTokens, Tokens, _iterator2, _step2, _user, _i2, _Tokens;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _Reservation["default"].find({}).select("_id client startTime endTime notUserDeviceToken");

          case 3:
            reservations = _context.sent;
            nowTime = new Date().getTime(); //시작 10분전인 예약

            reservationList = reservations.filter(function (e) {
              return new Date(e.startTime).getTime() - nowTime <= 602000 && new Date(e.startTime).getTime() - nowTime > 540000;
            }); //종료 10분전인 예약

            endReservationList = reservations.filter(function (e) {
              return new Date(e.endTime).getTime() - nowTime <= 602000 && new Date(e.endTime).getTime() - nowTime > 540000;
            });

            if (!(reservationList.length != 0)) {
              _context.next = 36;
              break;
            }

            deviceTokens = [];
            _iterator = _createForOfIteratorHelper(reservationList);
            _context.prev = 10;

            _iterator.s();

          case 12:
            if ((_step = _iterator.n()).done) {
              _context.next = 26;
              break;
            }

            e = _step.value;

            if (e.client) {
              _context.next = 19;
              break;
            }

            console.log("비회원 토큰" + e.notUserDeviceToken);
            deviceTokens.push(e.notUserDeviceToken);
            _context.next = 24;
            break;

          case 19:
            _context.next = 21;
            return _User["default"].findOne({
              _id: e.client
            }).select("deviceToken");

          case 21:
            user = _context.sent;
            console.log("회원 토큰" + user.deviceToken);
            deviceTokens.push(user.deviceToken);

          case 24:
            _context.next = 12;
            break;

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](10);

            _iterator.e(_context.t0);

          case 31:
            _context.prev = 31;

            _iterator.f();

            return _context.finish(31);

          case 34:
            console.log("푸시 보낼 토큰", e);

            for (_i = 0, _deviceTokens = deviceTokens; _i < _deviceTokens.length; _i++) {
              e = _deviceTokens[_i];
              (0, _pushAlarm.sendMessage)(e, "예약시간 확인", "예약하신 주차 시작 시간 10분 전입니다.");
            }

          case 36:
            if (!(endReservationList.length != 0)) {
              _context.next = 63;
              break;
            }

            Tokens = [];
            _iterator2 = _createForOfIteratorHelper(endReservationList);
            _context.prev = 39;

            _iterator2.s();

          case 41:
            if ((_step2 = _iterator2.n()).done) {
              _context.next = 54;
              break;
            }

            e = _step2.value;

            if (e.client) {
              _context.next = 47;
              break;
            }

            Tokens.push(e.notUserDeviceToken);
            _context.next = 52;
            break;

          case 47:
            _context.next = 49;
            return _User["default"].findOne({
              _id: e.client
            }).select("deviceToken");

          case 49:
            _user = _context.sent;
            console.log(_user);
            Tokens.push(_user.deviceToken);

          case 52:
            _context.next = 41;
            break;

          case 54:
            _context.next = 59;
            break;

          case 56:
            _context.prev = 56;
            _context.t1 = _context["catch"](39);

            _iterator2.e(_context.t1);

          case 59:
            _context.prev = 59;

            _iterator2.f();

            return _context.finish(59);

          case 62:
            for (_i2 = 0, _Tokens = Tokens; _i2 < _Tokens.length; _i2++) {
              e = _Tokens[_i2];
              (0, _pushAlarm.sendMessage)(e, "종료시간 확인", "종료시간 10분 전입니다. 종료시에 지난 예약에서 리뷰를 작성해주시면 포인트를 드립니다.");
            }

          case 63:
            _context.next = 68;
            break;

          case 65:
            _context.prev = 65;
            _context.t2 = _context["catch"](0);
            console.log("db갱신 ERROR" + _context.t2);

          case 68:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 65], [10, 28, 31, 34], [39, 56, 59, 62]]);
  }));

  return function dbSharedLocation() {
    return _ref.apply(this, arguments);
  };
}();

var _default = function _default() {
  (0, _nodeSchedule.scheduleJob)({
    rule: "0 * * * * *"
  }, function () {
    console.log("db\uAC31\uC2E0: ".concat((0, _moment["default"])().format("YYYY년 MM월 DD일 hh:mm:ss")));
    dbSharedLocation();
  });
};

exports["default"] = _default;