const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const User = require('../models/User');

function buildUserDetails(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    fullName: `${user.firstName} ${user.lastName}`
  };
}

router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized, you shall provide a valid JWT token in your request.',
    });
  }
  try {
    const {email,userId} = req.query;
    jwt.verify(token, process.env.API_SECRET);

    if (email) {
      const user = await User.findOne({email});  
      if (!user) {
        return res.status(400).json({error: 'User with such email does not exist.'});
      }
      return res.status(200).json(buildUserDetails(user));
    }
    
    if (userId) {
      const user = await User.findById(new mongoose.Types.ObjectId(userId));     
      if (!user) {
        return res.status(400).json({error: 'User with such id does not exist.'});
      }
      return res.status(200).json(buildUserDetails(user));
    }

    const allUsers = await User.find({});
    const allUserDetails = allUsers.map((user) => buildUserDetails(user));
    
    return res.status(200).json(allUserDetails);

  } catch (err) {
    console.error(err);
    if (['JsonWebTokenError','TokenExpiredError'].includes(err.name)) {
      return res.status(403).json({
        error: 'Forbidden, provided JWT token is invalid or expired.',
      });
    } 
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

module.exports = router;
