// TODO userBuisness
const _ = require('lodash');
const userRepository = require('../repositories/UserRepository');

const { sendResponse, sendError, sendErrorMessage } = require('../utils/responseHandler');

const list = (req, res) =>
  userRepository.list()
    .then(users => sendResponse(res, users))
    .catch(err => sendError(res, err, 500));

const listStudents = (req, res) =>
  userRepository.listStudents()
    .then(users => sendResponse(res, users))
    .catch(err => sendError(res, err, 500));

const listTeachers = (req, res) =>
  userRepository.listTeachers()
    .then(users => sendResponse(res, users))
    .catch(err => sendError(res, err, 500));

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return userRepository.getById(id, populate !== undefined)
    .then(user => sendResponse(res, user))
    .catch(err => sendErrorMessage(res, err, 'Cannot find user', `User with id: ${id} not found.`));
};

const create = (req, res) => {
  const { body } = req;

  const {
    name, email, role, group,
  } = _.pick(body, ['name', 'email', 'role', 'group']);

  const groups = group ? [group] : [];

  return userRepository.create({
    name, email, role, groups,
  })
    .then(user => sendResponse(res, user))
    .catch(err => sendError(res, err, 500));
};

const update = (req, res) => {
  // const newUser = _.pick(body, )
};


module.exports = {
  list,
  get,
  create,
  update,
  listTeachers,
  listStudents,
};
