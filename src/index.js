require('dotenv').config();

const express = require('express');

const passport = require('passport'); // TODO: passport
const Promise = require('bluebird'); // eslint-disable-line no-unused-vars

const mongoose = require('./config/mongoose');
const socket = require('./config/socket');
const config = require('./config/config');
const Logger = require('./api/utils/logger');
const { sendErrorMessage } = require('./api/utils/responseHandler');

const { port } = config.server;

const app = express();

require('./config/passport')(passport, app);
require('./config/express')(app);

app.all('*', (req, res, next) => {
  Logger.info(`${req.method} - ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    Logger.info(`${req.method} OBJECT: \n ${JSON.stringify(req.body, null, 2)}`);
  }
  next();
});

require('./config/routes')(app, passport);

app.all('*', (req, res) => {
  Logger.error(`${req.method} - ${req.url}`);
  sendErrorMessage(res, new Error('Not found'), 'Not found', `${req.method} - ${req.url} not available`, 404);
});

mongoose.connect();
socket.init(app);

app.listen(port, () => {
  Logger.info(`server listening to http://localhost:${port}`);
});
