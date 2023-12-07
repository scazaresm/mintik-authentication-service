const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', authenticateToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error:
        'Unauthorized, you shall provide a valid JWT token in your request.',
    });
  }

  jwt.verify(token, process.env.API_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({
        error:
          'Forbidden, provided JWT token is invalid.',
      });
    }
    const userDetails = await User.findById(user.userId);
    if (!userDetails) { 
      return res.status(500).json({
        error:
          'Failed to retrieve user details in authentication service.',
      });
    } 
    return res.status(200).json({
      id: userDetails._id,
      email: userDetails.email,
      role: userDetails.role,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      displayName: userDetails.displayName,
      fullName: `${userDetails.firstName} ${userDetails.lastName}`
    });
  });
});

module.exports = router;