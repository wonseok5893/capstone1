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

var dbSharedLocation = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {// const reservation = await Reservation.find({});
              // console.log(reservation);
              // const user = await User.findOne({ userId: req.decoded.userId });
              // console.log(user.reservation);
              // user.reservation.pull(_id);
              // user.save((err) => console.log(err));
              // const sharedlocation = await SharedLocation.findOne({
              //   _id: reservation.location,
              // });
              // sharedlocation.reservationList.pull(_id);
              // sharedlocation.save((err) => {
              //   if (err) console.log(err);
              // });
              // await Reservation.findByIdAndDelete({ _id }, (err) => {
              //   if (err) res.json({ result: "fail", message: "삭제 실패" });
              //   else {
              //     res.json({ result: "success", message: "삭제 완료" });
              //   }
              // });
            } catch (error) {
              console.log("db갱신 ERROR" + error);
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
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