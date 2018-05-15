const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { google } = require('../config').password;

module.exports = new GoogleStrategy(
  {
    ...google,
  },
  ((accessToken, refreshToken, profile, cb) => {

    cb('');
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }),
);
