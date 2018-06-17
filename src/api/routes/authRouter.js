const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../config/config');

const authRouter = express.Router();

const { sendErrorMessage } = require('../utils/responseHandler');

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get(
  '/google/callback',
  (req, res) => {
    passport.authenticate('google', { session: false, scope: ['email', 'profile'] }, (err, user) => {
      
      if (err && err.name === 'TokenError') {
        console.log(err, user);
      }

      if (err || !user) {
        return sendErrorMessage(res, err, 'something is wrong', 'Error', 400);
      }
      return req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign(user, jwtSecret);
        return res.json({ user, token });
      });
    })(req, res);
  },
);

module.exports = authRouter;
