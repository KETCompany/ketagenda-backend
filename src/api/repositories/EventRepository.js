const moment = require('moment');

const {
  Event,
} = require('../models/event.model');

const Logger = require('../utils/logger');

const bookingRepository = require('../repositories/BookingRepository');

const list = () =>
  Event.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Event.findById(id)
    .populate(populate ? 'bookings' : '')
    .populate(populate ? 'groups' : '')
    .populate(populate ? 'owner' : '')
    .populate(populate ? 'subscribers' : '')
    .then((event) => {
      if (event) {
        return event;
      }

      throw new Error(`User ${id} not found`);
    });

const create = (body) => {
  const { bookings, ...eventBody } = body;
  const event = new Event(eventBody);

  return event.save()
    .then((e) => {
      Logger.info('Event has successfully created');
      const { _id: eventId } = e;
      const promises = [];
      bookings.forEach((booking) => {
        promises.push(bookingRepository.create({
          ...booking,
          start: moment.unix(booking.start).toDate(),
          end: moment.unix(booking.end).toDate(),
          event: eventId,
        })
          .then(value => ({ value }))
          .catch(error => ({ error })));
      });

      return Promise.all(promises)
        .then((response) => {
          const errors = response.filter(r => r.error);
          e.bookings = [...e.bookings, ...response.filter(resp => resp.value).map(({ value: { _id } }) => _id)];

          if (e.bookings.length === 0) {
            Logger.warn('Event has been deleted');
            return e.remove()
              .then(() => Promise.reject(new Error(errors ? errors[0].error : 'no bookings for event found')));
          }
          return e.save();
        });
    });
};

module.exports = {
  list,
  getById,
  create,
};
