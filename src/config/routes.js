const apiRouter = require('../api/routes/apiRouter');
const authRouter = require('../api/routes/authRouter');
const roomController = require('../api/controllers/room.controller');
const { sendErrorMessage, sendError } = require('../api/utils/responseHandler');

module.exports = ((app, passport) => {
  app.get('/', (req, res) => {
    res.json({ hello: 'world' });
  });
  app.use('/auth', authRouter);
  
  app.get('/api/infoscreen', roomController.getByInfoScreen);
  app.put('/api/infoscreen/:id', roomController.update);

  app.get('/api/infoscreen/rooms', roomController.list);

  app.use('/api', (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err); }

    if ((info && info.message === 'No auth token') || !user) {
      return sendErrorMessage(res, info, 'User not authenticated', '...', 401);
    }

    return req.login(user, { session: false }, (error) => {
      if (error) { sendError(res, error); }
      next();
    });
  })(req, res, next), apiRouter);
});
