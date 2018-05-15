require('dotenv').config();

const express = require('express');
const passport = require('passport'); // TODO: passport
const Promise = require('bluebird'); // eslint-disable-line no-unused-vars

const mongoose = require('./config/mongoose');
const config = require('./config/config');

const { port } = config.server;


const app = express();

// require('./config/passport')(passport);
require('./config/express')(app);
require('./config/routes')(app);

mongoose.connect();

app.listen(port, () => {
  console.log(`server listening to http://localhost:${port}`);
});
