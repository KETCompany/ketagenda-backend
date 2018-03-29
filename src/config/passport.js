const google = require('./passport/google');

module.exports = (passport) => {
  passport.use(google);
};
