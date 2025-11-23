const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
