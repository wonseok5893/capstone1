import "./db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const handleListening = () =>
  console.log(`Server is Opened: https://parkingReservation.herokuapp.com`);

app.listen(process.env.PORT || 5800, handleListening);
