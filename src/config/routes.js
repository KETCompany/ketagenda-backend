const apiRouter = require('../api/routes/apiRouter');

module.exports = ((app) => {
  app.get('/', (req, res) => {
    res.json({ hello: 'world' });
  });

  app.use('/api', apiRouter);
});
