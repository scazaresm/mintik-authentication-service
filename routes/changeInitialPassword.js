const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');

router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const password = req.body?.newPassword;

  if (!token) {
    return res.status(401).json({
      error: 'A valid JWT token shall be provided in the request.',
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
    userDetails.password = password;
    userDetails.hasInitialPassword = false;
    await userDetails.save();

    return res.status(200).json({
      id: userDetails._id,
      email: userDetails.email,
      role: userDetails.role,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      displayName: userDetails.displayName,
      fullName: `${userDetails.firstName} ${userDetails.lastName}`,
      hasInitialPassword: userDetails.hasInitialPassword,
    });
  });
});

module.exports = router;
