const bodyParser = require('body-parser');
const cors = require('cors');

const Logger = require('../api/utils/logger');

function logErrors(err, req, res, next) {
  Logger.error(err.stack);
  next(err);
}

module.exports = ((app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(logErrors);
});
