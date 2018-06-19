const moment = require('moment');

const {
  Event,
} = require('../models/event.model');

const {
  Booking,
} = require('../models/booking.model');

const Logger = require('../utils/logger');

const bookingRepository = require('../repositories/BookingRepository');

const { mongoErrorHandler, notFoundHandler } = require('../utils/errorHandler');

const list = populate =>
  Event.find({})
    .sort({ createdAt: -1 })
    .populate(populate ? 'owner' : '')
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Event.findById(id)
    .populate(populate ? 'bookings' : '')
    .populate(populate ? 'groups' : '')
    .populate(populate ? 'owner' : '')
    .populate(populate ? 'subscribers' : '')
    .then(notFoundHandler(id, 'Event'))
    .catch(mongoErrorHandler);

const getByGroupId = (id, populate) =>
  Event.find({ groups: { $elemMatch: { $eq: id } } }).populate(populate ? 'bookings' : '');

const remove = id =>
  Booking.findOne({ event: id })
    .then((booking) => {
      if (booking) {
        throw new Error('Not safe to delete event has bookings');
      } else {
        return Event.findByIdAndRemove(id)
          .then(notFoundHandler(id, 'Event'));
      }
    });

const removeAll = id =>
  Promise.all([
    Booking.remove({ event: id }),
    Event.findByIdAndRemove(id),
  ])
    .then(([_, eventRemove]) => notFoundHandler(id, 'Event')(eventRemove))
    .catch(mongoErrorHandler);

const update = (id, body) =>
  Event.findByIdAndUpdate(id, body, { new: true })
    .then(notFoundHandler(id, 'Event'))
    .catch(mongoErrorHandler);


const create = (body) => {
  const event = new Event(body);

  return event.save();
};

module.exports = {
  list,
  getById,
  create,
  remove,
  removeAll,
  update,
  getByGroupId,
};
