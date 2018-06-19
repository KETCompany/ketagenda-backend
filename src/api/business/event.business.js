const eventRepository = require('../repositories/EventRepository');
const bookingRepository = require('../repositories/BookingRepository');

const listEvents = populate =>
  eventRepository.list(populate);

const listEventBookings = id =>
  bookingRepository.getByEventId(id);

module.exports = {
  listEvents,
  listEventBookings,
};
