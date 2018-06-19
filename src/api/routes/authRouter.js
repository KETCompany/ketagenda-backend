const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const jwtSimple = require('jwt-simple');


const { jwtSecret } = require('../../config/config');
const Logger = require('../utils/logger');

const authRouter = express.Router();

const userRepository = require('../repositories/UserRepository');

// const { auth } = require('firebase-admin');

const { sendErrorMessage, sendError, sendResponse } = require('../utils/responseHandler');

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get(
  '/google/callback',
  (req, res) => {
    passport.authenticate('google', { session: false, scope: ['email', 'profile'] }, (err, user) => {
      if (err && err.name === 'TokenError') {
        return sendErrorMessage(res, err, 'something is wrong', 'Error', 400);
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

        Logger.info(token);
        // Send token back to client
        res.statusCode = 302;
        res.setHeader('Location', `${process.env.CLIENT_URL}/callback?token=${token}`);
        res.setHeader('Content-Length', '0');
        res.end();
      });
    })(req, res);
  },
);

authRouter.get(
  '/firebase/callback',
  (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      try {
        const decode = jwtSimple.decode(req.headers.authorization.split(' ')[1], '', true)

        return userRepository.getByGoogleId(decode.sub)
          .then((googleUser) => {
            if (googleUser) {
              Logger.info('Found user by googleID', googleUser);
              return googleUser;
            }
            Logger.info('No user found by GoogleID');
            return userRepository.getByEmail(decode.email)
              .then((user) => {
                if (user) {
                  Logger.info('Found user by email', user);
                  user.googleId = decode.sub;
                  return user.save();
                }
                Logger.info('No user found by email... Creating new user');
                return userRepository.create({
                  googleId: decode.sub,
                  short: decode.email.split('@')[0],
                  name: decode.name,
                  email: decode.email,
                  role: 'Student',
                });
              }).then(user => user.toJSON());
          })
          .then((user) => {
            const token = jwt.sign(user, jwtSecret);
            Logger.info(token);
            return sendResponse(res, {
              jwtToken: token,
            });
          });
      } catch (err) {
        return sendError(res, err);
      }
    }
    return sendError(res, new Error('NO USER'));
  },
);

module.exports = authRouter;
