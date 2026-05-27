const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      db.get(
        "SELECT id, name, email FROM users WHERE id = ?",
        [decoded.id],
        (err, user) => {
          if (err || !user) {
            return res.status(401).json({
              message: "Not authorized",
            });
          }

          req.user = user;

          next();
        }
      );
    } catch (error) {
      return res.status(401).json({
        message: "Token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = protect;