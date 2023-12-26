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
const {check, validationResult} = require('express-validator');
const router = express.Router();

const User = require('../models/User');

router.post('/',
    [
      check('email').isLength({min: 5}).withMessage('email lenght shall be 5 at least'),
      check('password').isLength({min: 6}).withMessage('password lenght shall be 6 at least'),
      check('firstName').isLength({min: 1}).withMessage('firstName is required'),
      check('firstName').isLength({min: 1}).withMessage('lastName is required'),
      check('displayName').isLength({min: 1}).withMessage('displayName is required'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const {
        email,
        password,
        role,
        firstName,
        lastName,
        displayName,
      } = req.body;

      try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
          return res.status(400).json({errors: ['User already exists']});
        }

        const newUser = new User({
          email,
          password,
          role,
          firstName,
          lastName,
          displayName,
        });
        await newUser.save();

        res.status(201).json({message: 'User registered successfully'});
      } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({errors: [`Internal server error: ${err}`]});
      }
    },
);

module.exports = router;
