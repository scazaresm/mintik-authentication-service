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
      fullName: `${userDetails.firstName} ${userDetails.lastName}`,
    });
  });
});

module.exports = router;
