import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// local 1 2 cloud
// const localDBURL = "mongodb://localhost:27017/parkingApp";
//cloud MONGODB_URL
mongoose.connect(process.env.MONGODB_LOCAL_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log(`Error on DB Connection: ${error}`);
db.once("open", handleOpen);
db.on("error", handleError);
export default db;
