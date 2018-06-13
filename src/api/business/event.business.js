const eventRepository = require('../repositories/EventRepository');
const bookingRepository = require('../repositories/BookingRepository');

const listEvents = () =>
  eventRepository.list();

const listEventBookings = id =>
  bookingRepository.getByEventId(id);

module.exports = {
  listEvents,
  listEventBookings,
};
