const mongoose = require("mongoose");

const Loads = mongoose.model(
  "Loads",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    payload: {
      type: Number,
      required: true,
    },
    created_by: String,
    pickup_address: String,
    delivery_address: String,
    dimensions: {
      width: Number,
      length: Number,
      height: Number,
    },
    status: String,
    logs: {
      message: String,
      time: {
        type: Date,
        default: Date.now(),
      },
    },
    created_date: {
      type: Date,
      default: Date.now(),
    },
  })
);

module.exports = {
  Loads,
};
