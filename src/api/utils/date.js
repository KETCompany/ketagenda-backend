const moment = require('moment');

const startEndDate = (date) => {
  let start;
  let end;


  if (date === 'day' || date === 'week') {
    start = moment().startOf(date);
    end = moment().endOf(date);
  } else {

  }

  return { start, end };
};

module.exports = {
  startEndDate,
};
