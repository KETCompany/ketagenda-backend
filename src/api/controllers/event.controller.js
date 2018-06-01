const _ = require('lodash');
const eventRepository = require('../repositories/EventRepository');
const bookingRepository = require('../repositories/BookingRepository');

const list = (req, res) => {
  const { query } = req;
  const { id } = req.params;

  if (id) {
    return bookingRepository.getByEventId(id)
      .then(events => res.send(events));
  }

  return eventRepository.list()
    .then(events => res.send(events))
    .catch(err => console.log(err));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return eventRepository.getById(id, populate !== undefined)
    .then(event => res.send(event))
    .catch((err) => {
      console.error(err);
    });
};

const create = (req, res) => {
  const { body } = req;

  const event = _.pick(body, 'name', 'description', 'owner', 'groups', 'users', 'bookings');

  return eventRepository.create(event)
    .then((response) => {
      return res.json(response);
    }).catch(err =>
      res.json({ ok: err }) &&
      console.log('---> ERROR -> ', err));
};

const update = (req, res) => {

};

module.exports = {
  list,
  get,
  create,
  update,
};
