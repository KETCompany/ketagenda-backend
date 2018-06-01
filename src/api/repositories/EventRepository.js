const {
  Event,
} = require('../models/event.model');

const bookingRepository = require('../repositories/BookingRepository');


const list = () =>
  Event.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Event.find({ _id: id })
    .populate(populate ? 'bookings' : '')
    .populate(populate ? 'groups' : '')
    .populate(populate ? 'subscribers' : '');

const create = (body) => {
  const { bookings, ...eventBody } = body;
  const event = new Event(eventBody);

  return event.save()
    .then((e) => {
      const { _id } = e;
      const promises = [];
      bookings.forEach((booking) => {
        promises.push(bookingRepository.create({ ...booking, event: _id }));
      });

      return Promise.all(promises)
        .then((response) => {
          console.log('----> ', response);
          e.bookings = [...e.bookings, ...response.map(e => e._id)];
          return e.save();
        });
    });
};

module.exports = {
  list,
  getById,
  create,
};
