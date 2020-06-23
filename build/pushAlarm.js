"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = void 0;

var _fcmNode = _interopRequireDefault(require("fcm-node"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var serverKey = process.env.FIREBASE_KEY; //put your server key here

var fcm = new _fcmNode["default"](serverKey);

var sendMessage = function sendMessage(deviceToken, title, body) {
  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: deviceToken,
    notification: {
      title: title,
      body: body,
      sound: "default",
      click_action: "FCM_PLUGIN_ACTIVITY",
      icon: "fcm_push_icon"
    }
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.error("Push메시지 발송에 실패했습니다.");
      console.error(err);
      return;
    }

    console.log("Push메시지가 발송되었습니다.");
    console.log(response);
    console.log(response.results);
  });
};

exports.sendMessage = sendMessage;