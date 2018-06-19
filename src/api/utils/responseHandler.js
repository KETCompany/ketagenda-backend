const Logger = require('./logger');

const sendResponse = (res, object) => {
  Logger.info('Response send with status \'200\'');
  res.status(200);
  return res.json(object);
};

const sendError = (res, error, status) => {
  Logger.error(error);

  res.status(status || 500);
  return res.send({
    title: error.message,
    description: error.stack,
  });
};

const sendErrorMessage = (res, error, title, message, status) => {
  Logger.error(`${error} - status ${status || 500}`);

  res.status(status || 500);
  return res.send({
    title,
    description: message,
  });
};

const sendValidationError = (res, field, message, status) => {
  const title = `Validation error: ${field}`;
  Logger.error(`Validation error: ${message}`);

  res.status(status || 500);
  return res.send({
    title,
    description: message,
  });
};


module.exports.sendResponse = sendResponse;

module.exports = {
  sendResponse, sendError, sendErrorMessage, sendValidationError,
};
