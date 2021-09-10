const jwt = require("jsonwebtoken");

module.exports.authMiddleware = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(401)
      .json({ message: `Please provide 'authorization' header` });
  }
  const [, token] = req.headers["authorization"].split(" ");

  if (!token) {
    return res.status(401).json({ message: "Please provide a token" });
  }
  req.user = jwt.verify(token, "secretRDNode.js");
  next();
};
