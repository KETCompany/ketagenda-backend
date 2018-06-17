const apiRouter = require('../api/routes/apiRouter');
const authRouter = require('../api/routes/authRouter');

module.exports = ((app, passport) => {
  app.get('/', (req, res) => {
    res.json({ hello: 'world' });
  });
  app.use('/auth', authRouter);
  app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);
});
