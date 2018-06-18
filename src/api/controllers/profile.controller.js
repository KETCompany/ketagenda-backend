const _ = require('lodash');
const userRepository = require('../repositories/UserRepository');

const { sendResponse, sendError, sendErrorMessage } = require('../utils/responseHandler');

const self = (req, res) =>
  userRepository.getById(req.user._id)
    .then(user => sendResponse(res, user))
    .catch(err => sendError(res, err, 400));

const update = (req, res) => {
  const { body } = req;
  const user = _.pick(body, ['name', 'email', 'role', 'groups', 'short', 'fmcToken']);

  return userRepository.update(req.user._id, user)
    .then(updatedUser => sendResponse(res, updatedUser))
    .catch(err => sendError(res, err, 400));
};

module.exports = {
  self,
  update,
};
