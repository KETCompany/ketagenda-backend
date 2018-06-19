const google = require('./passport/google');
const JWT = require('./passport/jwt');

module.exports = (passport) => {
  passport.use(google);
  passport.use(JWT);
};
