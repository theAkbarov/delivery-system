const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const router = express.Router();

const { asyncWrapper } = require("../utils/errorHandler");
const { User } = require("../models/User");

router.post(
  "/register",
  asyncWrapper(async (req, res) => {
    const { email, role, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Bad request" });
    }

    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ message: `User with '${email}' email is already registered!` });
    }
    const user = new User({
      email,
      role,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    res.json(200).json({ message: "Succeess" });
  })
);
router.post(
  "/login",
  asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: `User with: ${email} is not found!` });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      "secretRDNode.js"
    );
    res.status(200).json({
      jwt_token: token,
    });
  })
);
router.post(
  "/forgot_password",
  asyncWrapper(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with: ${email} is not found!` });
    }
    const ProtonMail = require('protonmail-api');

(async () => {
  const pm = await ProtonMail.connect({
    username: 'foobar@protonmail.com',
    password: 'somethingsecure'
  })

  await pm.sendEmail({
    to: 'justin@kalland.ch',
    subject: 'Send email tutorial',
    body: 'Hello world'
  })

  pm.close()
})()
    res.status(200).json({ email: "New password sent to your email address" });
  })
);
module.exports = {
  authRouter: router,
};
