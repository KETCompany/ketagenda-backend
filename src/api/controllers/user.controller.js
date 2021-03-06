const _ = require('lodash');
const userRepository = require('../repositories/UserRepository');

const { sendResponse, sendError, sendErrorMessage } = require('../utils/responseHandler');

const userBusiness = require('../business/user.business');

const list = (req, res) =>
  userRepository.list()
    .then(users => sendResponse(res, users))
    .catch(err => sendError(res, err, 400));

const listStudents = (req, res) =>
  userRepository.listStudents()
    .then(users => sendResponse(res, users))
    .catch(err => sendError(res, err, 400));

const listTeachers = (req, res) =>
  userRepository.listTeachers()
    .then(users => sendResponse(res, users))
    .catch(err => sendError(res, err, 400));

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return userRepository.getById(id, populate !== undefined)
    .then(user => sendResponse(res, user))
    .catch(err => sendErrorMessage(res, err, 'Cannot find user', `User with id: ${id} not found.`, 404));
};

const create = (req, res) => {
  const { body } = req;

  const {
    name, email, role, groups, short,
  } = _.pick(body, ['name', 'email', 'role', 'groups', 'short']);

  if (!email) {
    return sendErrorMessage(res, new Error('Email required'), 'Validation error', 'Email is required', 400);
  }

  const groupsV = _.isArray(groups) ? groups : groups || [];

  return userBusiness.create({
    name, email, role, groups: groupsV, short,
  })
    .then(user => sendResponse(res, user))
    .catch(err => sendError(res, err, 400));
};

const update = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const user = _.pick(body, ['name', 'email', 'role', 'groups', 'short', 'fmcToken']);

  return userBusiness.update(id, user)
    .then(newUser => sendResponse(res, newUser))
    .catch(err => sendError(res, err, 400));
};

const remove = (req, res) => {
  const { id } = req.params;

  return userBusiness.remove(id)
    .then(() => sendResponse(res, { removed: true }))
    .catch(err => sendError(res, err, 404));
};

module.exports = {
  list,
  get,
  create,
  update,
  listTeachers,
  listStudents,
  remove,
};
