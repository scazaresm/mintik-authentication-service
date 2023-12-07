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

