const moment = require('moment');

const {
  Event,
} = require('../models/event.model');

const bookingRepository = require('../repositories/BookingRepository');

const list = () =>
  Event.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Event.findOne({ _id: id })
    .populate(populate ? 'bookings' : '')
    .populate(populate ? 'groups' : '')
    .populate(populate ? 'subscribers' : '');

const create = (body) => {
  const { bookings, ...eventBody } = body;
  const event = new Event(eventBody);

  return event.save()
    .then((e) => {
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
