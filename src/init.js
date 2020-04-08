import app from "./app";
const PORT = 5800;

const handleListening = () =>
  console.log(
    `Server is Opened: https://parkingReservation.herokuapp.com:${PORT}`
  );

app.listen(PORT, handleListening);
