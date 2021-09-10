const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  })
);
module.exports = {
  User,
};
