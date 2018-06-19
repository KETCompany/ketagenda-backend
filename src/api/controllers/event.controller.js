const _ = require('lodash');
const eventBusiness = require('../business/event.business');
const eventRepository = require('../repositories/EventRepository');

const responseHandler = require('../utils/responseHandler');
const Logger = require('../utils/logger');

const list = (req, res) => {
  const { query } = req;
  const { populate } = req.query;
  const { id } = req.params;

  // todo
  let promise;

  if (id) {
    promise = eventBusiness.listEventBookings(id);
  } else {
    promise = eventBusiness.listEvents(populate !== undefined);
  }


  return promise
    .then(response => responseHandler.sendResponse(res, response) && Logger.info(`Event count: ${response.length}`))
    .catch(err => responseHandler.sendError(res, err));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return eventRepository.getById(id, populate !== undefined)
    .then(user => responseHandler.sendResponse(res, user))
    .catch(err => responseHandler.sendErrorMessage(res, err, 'Cannot find event', `Event with id: ${id} not found.`, 404));
};

const create = (req, res) => {
  const { body } = req;

  const event = _.pick(body, 'name', 'description', 'owner', 'groups', 'subscribers', 'bookings');

  if (!event.name) {
    return responseHandler.sendValidationError(res, 'name', 'Name is required');
  }

  return eventRepository.create(event)
    .then(savedEvent => responseHandler.sendResponse(res, savedEvent))
    .catch(err => responseHandler.sendError(res, err, 400));
};

const update = (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const event = _.pick(body, 'name', 'description');

  return eventRepository.update(id, event)
    .then(updatedEvent => responseHandler.sendResponse(res, updatedEvent))
    .catch(err => responseHandler.sendError(res, err, 400));
};


const remove = (req, res) => {
  const { id } = req.params;
  const { force } = req.query;

  if (force !== undefined) {
    return eventRepository.removeAll(id)
      .then(() => responseHandler.sendResponse(res, { remove: true }))
      .catch(err => responseHandler.sendError(res, err));
  }

  return eventRepository.remove(id)
    .then(() => responseHandler.sendResponse(res, { remove: true }))
    .catch(err => responseHandler.sendError(res, err));
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
