const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../config/config');
const Logger = require('../utils/logger');

const authRouter = express.Router();

const { auth } = require('firebase-admin');


const { sendErrorMessage, sendError } = require('../utils/responseHandler');

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
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
      // console.log(req.headers.authorization.split(' ')[1]);
      return auth().verifyIdToken(req.headers.authorization.split(' ')[1])
        .then((decodedToken) => {
          console.log(decodedToken);
          const { uid } = decodedToken;
          // ...
        }).catch(error =>
          sendError(res, error));
    }
    return sendError(res, new Error('NO USER'));
  },
);

module.exports = authRouter;
