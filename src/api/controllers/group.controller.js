const _ = require('lodash');
const groupRepository = require('../repositories/GroupRepository');
const EventRepository = require('../repositories/EventRepository');
// const groupBuisness = require('../business/group.business');

const responseHandler = require('../utils/responseHandler');
const notificationHandler = require('../utils/notificationHandler');

const userBuisness = require('../business/user.business');

const list = (req, res) => {
  const { query } = req;

  let select;
  if (query.select) {
    select = query.select.split(',').filter(i => ['id', 'description', 'users', 'name'].includes(i));
  }

  return groupRepository.list(select)
    .then(groups => responseHandler.sendResponse(res, groups))
    .catch(err => responseHandler.sendError(res, err, 500));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return groupRepository.getById(id, populate !== undefined)
    .then((group) => {
      if (populate !== undefined) {
        return EventRepository.getByGroupId(group.id, populate !== undefined)
          .then((events) => {
            const groupWithEvents = group.toJSON();
            groupWithEvents.events = events;
            return groupWithEvents;
          });
      }
      return group;
    })
    .then(group => responseHandler.sendResponse(res, group))
    .catch(err => responseHandler.sendErrorMessage(res, err, 'Cannot find group', `Group with id: ${id} not found.`, 404));
};

const create = (req, res) => {
  const { body } = req;

  const { name, description, users } = _.pick(body, 'name', 'description', 'users');

  if (!name) {
    return responseHandler.sendValidationError(res, 'name', 'Name is required');
  }

  let usersV = [];

  if (_.isArray(users)) {
    usersV = users;
  } else if (users) {
    usersV = [users];
  }

  return groupRepository.create({ name, description, users: usersV })
    .then(response =>
      notificationHandler.sendToGroup(response._id, `Added to ${response.name}`, `Added to ${response.name}`)
        .then(() => responseHandler.sendResponse(res, response)))
    .catch(err => responseHandler.sendError(res, err, 500));
};

const update = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const { name, description, users } = _.pick(body, 'name', 'description', 'users');

  let usersV = [];

  if (_.isArray(users)) {
    usersV = users.map(user => (_.isObject(user) ? user._id : user));
  } else if (users) {
    usersV = [users];
  }

  return groupRepository.update(id, { name, description, users: usersV }, true)
    .then(response =>
      notificationHandler.sendToGroup(id, `${response.name} has been updated!`, `${response.name} has been updated!`)
        .then(() => responseHandler.sendResponse(res, response)))
    .catch(err => responseHandler.sendError(res, err, 500));
};

const remove = (req, res) => {
  const { id } = req.params;

  return groupRepository.remove(id)
    .then((response) => {
      return notificationHandler.sendToGroup(id, `${response.name} has been deleted!`, `${response.name} has been deleted!`, 'warning')
        .then(() => responseHandler.sendResponse(res, { removed: true }));
    })
    .catch(err => responseHandler.sendError(res, err, 500));
};

const subscribe = (req, res) => {
  const { body } = req;

  const { id } = _.pick(body, 'id');

  return userBuisness.joinGroup(req.user._id, id)
    .then(() => responseHandler.sendResponse(res, { joined: true }))
    .catch(err => responseHandler.sendError(res, err, 500));
};

const unSubscribe = (req, res) => {
  const { body } = req;

  const { id } = _.pick(body, 'id');

  return userBuisness.exitGroup(req.user._id, id)
    .then(() => responseHandler.sendResponse(res, { exited: true }))
    .catch(err => responseHandler.sendError(res, err, 500));
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  subscribe,
  unSubscribe,
};
