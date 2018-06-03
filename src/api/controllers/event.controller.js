const _ = require('lodash');
const eventBusiness = require('../business/event.business');
const eventRepository = require('../repositories/EventRepository');

const list = (req, res) => {
  const { query } = req;
  const { id } = req.params;

  // todo
  let promise;

  if (id) {
    promise = eventBusiness.listEventBookings(id);
  } else {
    promise = eventBusiness.listEvents();
  }

  return promise
    .then((json) => {
      res.json(json);
    })
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
