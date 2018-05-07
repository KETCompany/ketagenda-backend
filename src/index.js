require('dotenv').config();

const express = require('express');

const passport  = require('passport'); // TODO: passport
const mongoose  = require('./config/mongoose');
const socket    = require('./config/socket');

const Promise = require('bluebird'); // eslint-disable-line no-unused-vars

const port = process.env.PORT || 3000;

const app = express();

// require('./config/passport')(passport);
require('./config/express')(app);
require('./config/routes')(app);

mongoose.connect();
socket.init(app);

app.listen(port, () => {
  console.log(`server listening to http://localhost:${port}`);
});