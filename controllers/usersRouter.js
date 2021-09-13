const express = require("express");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { asyncWrapper } = require("../utils/errorHandler");
const { authMiddleware } = require("../middleware/authMidlleware");
const { User } = require("../models/User");
const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const user = await User.find({ _id: req.user._id });
   
    res.status(200).json({ user });
  })
);
router.delete(
  "/me",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    await User.findOneAndRemove({ _id: req.user._id });
    res.status(200).json({
      message: "Success",
    });
  })
);
router.patch(
  "/me/password",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $set: { password: await bcrypt.hash(newPassword, 10) } }
    );
    res.status(200).json({ message: "Success" });
  })
);

module.exports = {
  usersRouter: router,
};
