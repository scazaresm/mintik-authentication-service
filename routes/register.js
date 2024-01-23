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

const buildUserDetails = require('./utils/buildUserDetails');
const generateRandomPassword = require('./utils/generateRandomPassword');

const axios = require('axios');

const User = require('../models/User');

async function enqueueEmailNotification(data) {
  try {
    const {
      req,
      displayName,
      email,
      initialPassword,
    } = data;

    const apiUrl = process.env.MAILER_SERVICE_URL;
    const headers = {'Authorization': req.headers.authorization};
    const postData = {
      templateName: 'Welcome',
      contentVariables: [
        `#{DisplayName}=${displayName}`,
        `#{Email}=${email}`,
        `#{InitialPassword}=${initialPassword}`,
      ],
      subject: 'Welcome to Mechanical Sync!',
      to: [email],
    };
    await axios.post(`${apiUrl}/jobs`, postData, {headers});
  } catch (error) {
    console.error(error);
  }
}

router.post('/',
    [
      check('email').isLength({min: 5}).withMessage('email lenght shall be 5 at least'),
      check('role').isLength({min: 1}).withMessage('role is required'),
      check('lastName').isLength({min: 1}).withMessage('lastName is required'),
      check('displayName').isLength({min: 1}).withMessage('displayName is required'),
      check('enabled').isBoolean().withMessage('enabled is required and shall be a boolean'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const {
        email,
        role,
        firstName,
        lastName,
        displayName,
        enabled,
      } = req.body;

      try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
          return res.status(400).json({errors: ['User already exists']});
        }

        const initialPassword = generateRandomPassword(6);

        const newUser = new User({
          email,
          password: initialPassword,
          role,
          firstName,
          lastName,
          displayName,
          enabled,
          hasInitialPassword: true,
        });
        await newUser.save();

        // enqueue email notification asynchronously
        enqueueEmailNotification({
          req,
          displayName: newUser.displayName,
          email: newUser.email,
          initialPassword,
        });

        const userDetails = buildUserDetails(newUser);
        res.status(201).json(userDetails);
      } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({errors: [`Internal server error: ${err}`]});
      }
    },
);

module.exports = router;
