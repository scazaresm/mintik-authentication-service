// Commons Clause License
//
// The Software is provided to you by the Licensor under the License, as
// defined below, subject to the following condition.
//
// Without limiting other conditions in the License, the grant of rights
// under the License will not include, and the License does not grant to you,
// the right to sell, leverage, or otherwise commercialize the Software.
//
// For purposes of the foregoing, "sell" means practicing any or all of the
// rights granted to you under the License to provide to third parties,
// for a fee or other consideration (including without limitation fees
// for hosting or consulting/ support services related to the Software),
// a product or service whose value derives, entirely or substantially,
// from the functionality of the Software.
//
// Any license notice or attribution required by the License must also
// include this Commons Clause License Condition notice.
//
// Software: mintik-authentication-service
// License: MIT License
// Licensor: Sergio Cazares
// Commons Clause License URL: https://github.com/scazaresm/mintik-authentication-service/blob/main/LICENSE

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
        hasInitialPassword: user.hasInitialPassword,
      },
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

module.exports = router;
