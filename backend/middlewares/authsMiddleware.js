const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const authsMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { userId: decoded.userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.User = user;  // Attach the user to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authsMiddleware;
