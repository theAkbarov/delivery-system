const mongoose = require("mongoose");

const Trucks = mongoose.model(
  "Trucks",
  mongoose.Schema({
    created_by: String,
    assign_to: String,
    type: {
      required: true,
      type: String,
    },
    status: String,
    created_date: {
      type: Date,
      default: Date.now(),
    },
  })
);

module.exports = {
  Trucks,
};
