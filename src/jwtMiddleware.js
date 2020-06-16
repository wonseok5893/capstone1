import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtMiddleware = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;
  if (!token || token === "") {
    next();
  } else {
    await jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (!err) {
        req.decoded = decoded;
        if (req.decoded.userId === "wonseok") {
          if (
            req.connection.remoteAddress === "::ffff:175.119.165.7" ||
            req.connection.remoteAddress === "::ffff:192.168.0.1"
          ) {
            console.log("관리자 로그인 성공");
            next();
          } else {
            res.json({
              result: "fail",
              message: "잘못된 접근",
            });
          }
        } else {
          console.log("세션 로그인 성공");
          next();
        }
      } else {
        res.status(403).json({
          result: "fail",
          message: "Token error. 다시 로그인 해주세요.",
        });
      }
    });
  }
};

export const adminCheck = (req, res, next) => {
  if (
    req.connection.remoteAddress === "::ffff:175.119.165.7" ||
    req.connection.remoteAddress === "::ffff:192.168.0.1"
  )
    next();
  else {
    res.status(403).json({ result: "fail", message: "잘못된 접근" });
  }
};
