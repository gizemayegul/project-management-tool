// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
import mongoose from "mongoose";

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI =
  `mongodb://127.0.0.1:27017/${process.env.MONGODB_URI}` ||
  "mongodb://127.0.0.1:27017/fullstack";
console.log(MONGO_URI);
console.log(process.env.MONGODB_URI, "fb");

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(dbName);
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
