const {
  Booking,
} = require('../models/booking.model');

const moment = require('moment');

const list = () =>
  Booking.find({})
    .sort({ createdAt: -1 })
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Booking.findOne({ _id: id })
    .populate(populate ? 'users' : '');

const getByEventId = id =>
  Booking.find({ event: id });

const getByRoomId = (id, start, end, populate) => {
  const query = { room: id };
  if (start && end) {
    query.start = {
      $gte: start,
    };

    query.end = {
      $lte: end,
    };
  }

  return Booking.find(query)
    .populate(populate ? { path: 'event', select: 'name description' } : '');
};

const filterDate = (start, end) => {
  const startDate = moment.unix(start).toDate();
  return Booking.find({
    $and: [
      { start: { $not: { $gte: startDate } } },
      // { end: { $lte: startDate } }
    ],
  });

  return Promise.resolve('');
}

const listNow = () =>
  Booking.find({
    $and: [
      { start: { $lte: moment().toDate() } },
      { end: { $gte: moment().toDate() } },
    ],
  }, 'room');

const create = (body) => {
  const booking = new Booking(body);

  return booking.save();
};

const remove = id =>
  Booking.remove({ event: id });


module.exports = {
  list,
  getById,
  create,
  getByEventId,
  getByRoomId,
  listNow,
  remove,
};
