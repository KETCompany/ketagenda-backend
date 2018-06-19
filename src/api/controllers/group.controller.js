const _ = require('lodash');
const groupRepository = require('../repositories/GroupRepository');
const EventRepository = require('../repositories/EventRepository');
// const groupBuisness = require('../business/group.business');

const { sendResponse, sendErrorMessage, sendError } = require('../utils/responseHandler');
const notificationHandler = require('../utils/notificationHandler');

const list = (req, res) => {
  const { query } = req;

  let select;
  if (query.select) {
    select = query.select.split(',').filter(i => ['id', 'description', 'users', 'name'].includes(i));
  }

  return groupRepository.list(select)
    .then(groups => sendResponse(res, groups))
    .catch(err => sendError(res, err, 500));
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
    .then(group => sendResponse(res, group))
    .catch(err => sendErrorMessage(res, err, 'Cannot find group', `Group with id: ${id} not found.`, 404));
};

const create = (req, res) => {
  const { body } = req;

  const { name, description, users } = _.pick(body, 'name', 'description', 'users');

  let usersV = [];

  if (_.isArray(users)) {
    usersV = users;
  } else if (users) {
    usersV = [users];
  }

  return groupRepository.create({ name, description, users: usersV })
    .then((response) => {
      const tokens = response.users.filter(user => user.fmcToken !== '').map(user => user.fmcToken);

      return notificationHandler.subscribe(tokens, response._id)
        .then(() => notificationHandler.sendToGroup(response._id, `Added to ${response.name}`, `Added to ${response.name}`))
        .then(() => sendResponse(res, response));
    })
    .catch(err => sendError(res, err, 500));
};

const update = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const { name, description, users } = _.pick(body, 'name', 'description', 'users');

  let usersV = [];

  if (_.isArray(users)) {
    usersV = users;
  } else if (users) {
    usersV = [users];
  }

  return groupRepository.update(id, { name, description, users: usersV }, true)
    .then((response) => {
      const tokens = response.users.filter(user => user.fmcToken !== '').map(user => user.fmcToken);
      notificationHandler.subscribe(tokens, id)
        .then(() => notificationHandler.sendToGroup(id, `${response.name} has been updated!`, `${response.name} has been updated!`))
        .then(() => sendResponse(res, response));
    })
    .catch(err => sendError(res, err, 500));
};

const remove = (req, res) => {
  const { id } = req.params;

  return groupRepository.remove(id)
    .then((response) => {
      return notificationHandler.sendToGroup(id, `${response.name} has been deleted!`, `${response.name} has been deleted!`, 'warning')
        .then(() => sendResponse(res, { removed: true }));
    })
    .catch(err => sendError(res, err, 500));
};

const subscribe = (req, res) => {
  const { body } = req;

  const { id } = _.pick(body, 'id');
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  subscribe,
};
