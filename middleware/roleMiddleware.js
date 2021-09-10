const { User } = require("../models/User");

module.exports.roleMiddleware = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (user.role == "DRIVER") {
    req.role = "driver";
  } else {
    req.role = "shipper";
  }
  next();
};
