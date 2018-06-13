const { createLogger, format, transports } = require('winston');
const moment = require('moment');

const { combine, label, printf } = format;
const myFormat = printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);

const appendTimestamp = format((info) => {
  info.timestamp = moment().format();
  return info;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    format.colorize(),
    label({ label: 'main' }),
    appendTimestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;
