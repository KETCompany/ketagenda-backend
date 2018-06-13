const {
  Room,
} = require('../models/room.model');

const {
  Booking,
} = require('../models/booking.model');

const { mongoErrorHandler, notFoundHandler } = require('../utils/errorHandler');

const filters = query =>
  Promise.all([
    Room.distinct('floor', query),
    Room.distinct('location', query),
    Room.distinct('type', query),
  ]);

const names = query =>
  Room.distinct('name', query);

const groups = query =>
  Room.distinct('booked.group', query);

const list = (query, projection) =>
  Room.find(
    query,
    projection,
  ).collation({ locale: 'en', strength: 2 }).lean();

const create = (body) => {
  const room = new Room(body);

  return room.save()
    .catch(mongoErrorHandler);
};

const update = (id, body) =>
  Room.findByIdAndUpdate(id, body, { new: true }).lean()
    .then(notFoundHandler(id, 'Room'))
    .catch(mongoErrorHandler);

const remove = id =>
  Booking.find({ room: id })
    .then((bookings) => {
      if (bookings.length === 0) { // SAFE TO REMOVE
        return Room.findByIdAndRemove(id)
          .then(notFoundHandler(id, 'Room'));
      }
      throw new Error('Not safe to delete room has bookings');
    }).catch(mongoErrorHandler);

const getById = (id, populate) =>
  Room.findById(id)
    .populate(populate ? { path: 'bookings', options: { sort: { start: 1 } }, populate: { path: 'event', select: 'name description', populate: { path: 'groups owner', select: 'name' } } } : '')
    .then(notFoundHandler(id, 'Room'));

const getByDisplayKey = (key, populate) =>
  Room.findOne({ displayKeys: key })
    .populate(populate ? { path: 'bookings', populate: { path: 'event', select: 'name description' } } : '');

const listAdvanced = (match = {}, bookingMatch = []) =>
  Room.aggregate([
    { $match: match },
    { $unwind: '$bookings' },
    {
      $match: bookingMatch,
    },
    {
      $group: {
        _id: '$_id',
        location: { $first: '$location' },
        floor: { $first: '$floor' },
        number: { $first: '$number' },
        name: { $first: '$name' },
        type: { $first: '$type' },
        bookings: { $push: '$bookings' },
      },
    },
  ]);


module.exports = {
  filters,
  names,
  groups,
  list,
  listAdvanced,
  getById,
  getByDisplayKey,
  create,
  update,
  remove,
};
