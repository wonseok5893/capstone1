import "./db";
import app from "./app";
import scheduler from "./scheduler";
import dotenv from "dotenv";
dotenv.config();

const handleListening = () =>
  console.log(`Server is Opened: https://parkingReservation.herokuapp.com`);

console.log("스캐줄링 실행");
scheduler();
app.listen(process.env.PORT || 5800, handleListening);
