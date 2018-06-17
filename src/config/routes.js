const apiRouter = require('../api/routes/apiRouter');
const authRouter = require('../api/routes/authRouter');

const { sendErrorMessage, sendError } = require('../api/utils/responseHandler');

module.exports = ((app, passport) => {
  app.get('/', (req, res) => {
    res.json({ hello: 'world' });
  });
  app.use('/auth', authRouter);
  app.use('/api', (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (!user && !info) {
      return sendErrorMessage(res, new Error('No user'), 'No user', '...', 401);
    }
    if (info && info.message === 'No auth token') {
      return sendErrorMessage(res, info, 'User not authenticated', '...', 401);
    }
    req.login(user, { session: false }, (err) => {
      if (err) { sendError(res, err); }
      next();
    });
  })(req, res, next), apiRouter);
});
