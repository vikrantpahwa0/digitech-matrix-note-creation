const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Adds user details to `req.user`
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateUser;
