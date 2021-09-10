require("dotenv").config({ path: "../local.env" });
const mongoose = require("mongoose");

module.exports.connectMongo = () => {
  return mongoose.connect(process.env.MONGO_URI);
};
