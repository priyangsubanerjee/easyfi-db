const mongoose = require("mongoose"); // npm i mongoose
const connection = {};
require("dotenv").config();
const url = process.env.DB_URL;
// replace "<username>" and "<password>" with your database username & password

async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
  }
}

module.exports = dbConnect; // export this function so it can be used in other files to connect to the database
