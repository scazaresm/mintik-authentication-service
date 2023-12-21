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
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'A valid JWT token shall be provided in the request.',
    });
  }

  jwt.verify(token, process.env.API_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Provided JWT token is invalid and cannot be refreshed.',
      });
    }

    // Generate a new token with a refreshed expiration time
    const refreshedToken = jwt.sign(
        {userId: user.userId, role: user.role},
        process.env.API_SECRET,
        {expiresIn: '1h'},
    );

    res.json({token: refreshedToken});
  });
});

module.exports = router;

