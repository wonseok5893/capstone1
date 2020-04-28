import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtMiddleware = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;
  if (!token) {
    next();
  } else {
    await jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (!err) {
        req.decoded = decoded;
        console.log(decoded);
        console.log("세션 로그인 성공");
        next();
      } else {
        console.log(err);
        res.status(403).json({
          result: "fail",
          message: "Token error. 다시 로그인 해주세요.",
        });
      }
    });
  }
};
