const passportJWT = require('passport-jwt');

const { User } = require('../../api/models/user.model');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { jwtSecret, passport } = require('../config');

module.exports = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  },
  ({ _id }, cb) =>
    User.findById(_id)
      .then(user => cb(null, user))
      .catch(err => cb(err)),
);
