const Logger = require('./logger');

const mongoErrorHandler = (err) => {
  Logger.error(err);

  if (err.name === 'ValidationError') {
    throw new Error(err.message);
  }

  if (err.code === 11000) {
    throw new Error('There was a duplicate key error');
  }

  throw err;
};

const notFoundHandler = (id, field) => (object) => {
  if (object === null) {
    throw new Error(`${field} with ${id} not found`);
  }

  return object;
};

module.exports = {
  mongoErrorHandler,
  notFoundHandler,
};
