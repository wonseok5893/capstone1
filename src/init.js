import app from "./app";

const handleListening = () =>
  console.log(
    `Server is Opened: https://parkingReservation.herokuapp.com:${process.env.PORT}`
  );

app.listen(process.env.PORT || 5800, handleListening);
