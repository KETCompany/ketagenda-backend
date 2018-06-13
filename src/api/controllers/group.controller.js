const _ = require('lodash');
const groupRepository = require('../repositories/GroupRepository');
// const groupBuisness = require('../business/group.business');

const { sendResponse, sendErrorMessage, sendError } = require('../utils/responseHandler');

const list = (req, res) => {
  const { query } = req;

  return groupRepository.list()
    .then(groups => sendResponse(res, groups))
    .catch(err => sendError(res, err, 500));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return groupRepository.getById(id, populate !== undefined)
    .then(group => sendResponse(res, group))
    .catch(err => sendErrorMessage(res, err, 'Cannot find group', `Group with id: ${id} not found.`));
};

const create = (req, res) => {
  const { body } = req;

  const group = _.pick(body, 'name', 'description');

  return groupRepository.create(group)
    .then(response => sendResponse(res, response))
    .catch(err => sendError(res, err, 500));
};

const update = (req, res) => {

};

module.exports = {
  list,
  get,
  create,
  update,
};
