const mongoose = require('mongoose');
const config = require('./config');

mongoose.Promise = Promise;

const { host } = config.mongo;

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${host}`);
});

exports.connect = () => mongoose.connect(host, {
  keepAlive: 1,
}).connection;

