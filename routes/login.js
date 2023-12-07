const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');

router.post('/', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(401).json({error: 'User does not exist.'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    console.log(`Signing with secret: ${process.env.API_SECRET}`);

    const token = jwt.sign(
        {userId: user._id, role: user.role},
        process.env.API_SECRET,
        {expiresIn: '1h'},
    );

    res.json({
      userDetails: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        fullName: `${user.firstName} ${user.lastName}`,
      }, 
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

module.exports = router;
