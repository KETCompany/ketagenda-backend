// TODO userBuisness
const _ = require('lodash');
const userRepository = require('../repositories/UserRepository');

const { sendResponse, sendError, sendErrorMessage } = require('../utils/responseHandler');

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
    name, email, role, group, short,
  } = _.pick(body, ['name', 'email', 'role', 'groups', 'short']);


  if (!email) {
    return sendErrorMessage(res, new Error('Email required', 400));
  }

  const groups = _.isArray(group) ? group : group || [];


  return userRepository.create({
    name, email, role, groups, short,
  })
    .then(user => sendResponse(res, user))
    .catch(err => sendError(res, err, 400));
};

const update = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const user = _.pick(body, ['name', 'email', 'role', 'groups', 'short']);

  userRepository.update(id, user)
    .then(updatedUser => sendResponse(res, updatedUser))
    .catch(err => sendError(res, err, 400));
};


module.exports = {
  list,
  get,
  create,
  update,
  listTeachers,
  listStudents,
};
