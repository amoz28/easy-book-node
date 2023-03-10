const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function checkRole(allowedRoles) {
  return (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).json("Access denied. No token provided.");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userRole = decoded.role;
      const userEmail = decoded.email;
      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json(
            "Access denied. You do not have permission to access this resource."
          );
      }
      req.user = { role: userRole, email: userEmail };
      next();
    } catch (err) {
      res.status(400).json("Invalid token.");
    }
  };
}

module.exports = checkRole;
