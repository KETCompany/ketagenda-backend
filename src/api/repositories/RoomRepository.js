const {
  Room,
} = require('../models/room.model');

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

const getById = (id, populate) =>
  Room.findOne({ _id: id })
    .populate(populate ? { path: 'bookings', options: { sort: { start: 1 } }, populate: { path: 'event', select: 'name description', populate: { path: 'groups owner', select: 'name' } } } : '');

const getByKey = key =>
  Room.find({ displayKeys: key });

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

const insertBooking = (room, booking) =>
  Room.findOneAndUpdate(
    { _id: room },
    { $push: { bookings: booking } },
    { new: false },
  ).exec();

module.exports = {
  filters,
  names,
  groups,
  list,
  listAdvanced,
  getById,
  insertBooking,
  getByKey,
};
