const moment = require('moment');

const eventRepository = require('../repositories/EventRepository');
const bookingRepository = require('../repositories/BookingRepository');
const Logger = require('../utils/logger');

const listEvents = populate =>
  eventRepository.list(populate);

const listEventBookings = id =>
  bookingRepository.getByEventId(id);

const create = (eventBody) => {
  const { bookings, ...event } = eventBody;

  return eventRepository.create(event)
    .then((newEvent) => {
      Logger.info('Event has successfully created');
      if (bookings && bookings.length > 0) {
        Logger.info('Event has bookings');

        return Promise.all(bookings.map(booking =>
          bookingRepository.create({
            ...booking,
            start: moment.unix(booking.start).toDate(),
            end: moment.unix(booking.end).toDate(),
            event: newEvent.id,
          })))
          .then((response) => {
            const errors = response.filter(r => r.error);
            errors.forEach(Logger.error);
            newEvent.bookings = response.map((({ _id }) => _id));

            if (newEvent.bookings.length === 0) {
              Logger.warn('Event has been deleted');
              return newEvent.remove()
                .then(() => Promise.reject(new Error(errors.length ? errors[0].error : 'no bookings for event found')));
            }

            return newEvent.save();
          }).catch((err) => {
            Logger.warn('Event has been deleted');
            return newEvent.remove()
              .then(() => Promise.reject(err));
          });
      }
      return newEvent;
    });
};

const update = (id, eventBody) => {
  const { bookings, ...event } = eventBody;
  let oldBooings = [];
  return bookingRepository.getByEventId(id).lean()
    .then((bookingsR) => {
      oldBooings = bookingsR;
      return bookingRepository.remove(id);
    })
    .then(() => {
      if (bookings && bookings.length > 0) {
        return Promise.all(bookings.map(booking =>
          bookingRepository.create({
            ...booking,
            start: moment.unix(booking.start).toDate(),
            end: moment.unix(booking.end).toDate(),
            event: id,
          })))
          .then((response) => {
            const newBookings = response.map((({ _id }) => _id));
            return eventRepository.update(id, { ...eventBody, bookings: newBookings });
          });
      }
      return eventRepository.update(id, eventBody);
    })
    .catch(() => {
      return bookingRepository.remove(id)
        .then(() => oldBooings.map(({ _id, ...booking }) => bookingRepository.create(booking)))
        .then((response) => {
          const newBookings = response.map((({ _id }) => _id));
          return eventRepository.update(id, { ...eventBody, bookings: newBookings });
        });
    });
}

module.exports = {
  listEvents,
  listEventBookings,
  create,
  update,
};
