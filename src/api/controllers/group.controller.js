const _ = require('lodash');
const groupRepository = require('../repositories/GroupRepository');
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
    .then(group => sendResponse(res, group))
    .catch(err => sendErrorMessage(res, err, 'Cannot find group', `Group with id: ${id} not found.`, 404));
};

const create = (req, res) => {
  const { body } = req;

  const { name, description, users } = _.pick(body, 'name', 'description', 'users');

  const usersV = _.isArray(users) ? users : (users ? [users] : []);

  return groupRepository.create({ name, description, users: usersV })
    .then((response) => {
      const tokens = response.users.filter(user => user.fmcToken !== '').map(user => user.fmcToken);
      console.log(response._id);
      return notificationHandler.subscribe(tokens, response._id)
        .then(() => notificationHandler.sendToGroup(response._id, `Added to ${response.name}`, `Added to ${response.name}`))
        .then(() => sendResponse(res, response));
    })
    .catch(err => sendError(res, err, 500));
};

const update = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const group = _.pick(body, 'name', 'description');

  return groupRepository.update(id, group)
    .then(response => sendResponse(res, response))
    .catch(err => sendError(res, err, 500));
};

const remove = (req, res) => {
  const { id } = req.params;

  return groupRepository.remove(id)
    .then(() => sendResponse(res, { removed: true }))
    .catch(err => sendError(res, err, 500));
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
