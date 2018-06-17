const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { google } = require('../config').passport;
const userRepository = require('../../api/repositories/UserRepository');

const Logger = require('../../api/utils/logger');
module.exports = new GoogleStrategy(
  { ...google },
  ((accessToken, refreshToken, profile, cb) => {
    return userRepository.getByGoogleId(profile.id)
      .then((googleUser) => {
        if (googleUser) {
          Logger.info('Found user by googleID', googleUser);
          return cb(null, googleUser);
        }
        Logger.info('No user found by GoogleID');
        return userRepository.getByEmail(profile.emails ? profile.emails[0].value : '')
          .then((user) => {
            if (user) {
              Logger.info('Found user by email', user);
              user.googleId = profile.id;
              return user.save();
            }
            Logger.info('No user found by email... Creating new user');
            return userRepository.create({
              googleId: profile.id,
              short: profile.emails[0].value.split('@')[0],
              name: profile.displayName,
              email: profile.emails[0].value,
              role: 'Student',
            });
          })
          .then(user => cb(null, user.toJSON()))
          .catch(err => cb(err, null));
      });
  }),
);
