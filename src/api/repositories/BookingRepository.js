const {
  Booking,
} = require('../models/booking.model');

const list = () =>
  Booking.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Booking.find({ _id: id })
    .populate(populate ? 'users' : '');

const getByEventId = id =>
  Booking.find({ event: id });

const create = (body) => {
  const booking = new Booking(body);

  return booking.save();
};

module.exports = {
  list,
  getById,
  create,
  getByEventId,
};
