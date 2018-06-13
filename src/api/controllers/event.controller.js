const _ = require('lodash');
const eventBusiness = require('../business/event.business');
const eventRepository = require('../repositories/EventRepository');

const { sendResponse, sendError, sendErrorMessage } = require('../utils/responseHandler');
const Logger = require('../utils/logger');

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
    .then(response => sendResponse(res, response) && Logger.info(`Event count: ${response.length}`))
    .catch(err => sendError(res, err));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return eventRepository.getById(id, populate !== undefined)
    .then(user => sendResponse(res, user))
    .catch(err => sendErrorMessage(res, err, 'Cannot find event', `Event with id: ${id} not found.`));
};

const create = (req, res) => {
  const { body } = req;

  const event = _.pick(body, 'name', 'description', 'owner', 'groups', 'users', 'bookings');

  return eventRepository.create(event)
    .then(savedEvent => sendResponse(res, savedEvent))
    .catch(err => sendError(res, err, 500));
}

const update = (req, res) => {

};

module.exports = {
  list,
  get,
  create,
  update,
};
