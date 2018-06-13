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

const list = () =>
  Event.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Event.findById(id)
    .populate(populate ? 'bookings' : '')
    .populate(populate ? 'groups' : '')
    .populate(populate ? 'owner' : '')
    .populate(populate ? 'subscribers' : '')
    .then(notFoundHandler(id, 'Event'))
    .catch(mongoErrorHandler);

const remove = (id) => {
  return Booking.findOne({ event: id })
    .then((booking) => {
      if (booking) {
        throw new Error('Not safe to delete event has bookings');
      } else {
        return Event.findByIdAndRemove(id)
          .then(notFoundHandler(id, 'Event'));
      }
    });
};

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
  const { bookings, ...eventBody } = body;
  const event = new Event(eventBody);

  return event.save()
    .then((e) => {
      Logger.info('Event has successfully created');

      if (bookings && bookings.length > 0) {
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
            Logger.error(errors);
            e.bookings = [
              ...e.bookings,
              ...response
                .filter(resp => resp.value)
                .map(({ value: { _id } }) => _id)];

            if (e.bookings.length === 0) {
              Logger.warn('Event has been deleted');

              return e.remove()
                .then(() => Promise.reject(new Error(errors.length ? errors[0].error : 'no bookings for event found')));
            }
            return e.save();
          });
      }
      return e;
    });
};

module.exports = {
  list,
  getById,
  create,
  remove,
  removeAll,
  update,
};
