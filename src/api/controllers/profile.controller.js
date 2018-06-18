const _ = require('lodash');
const userBusiness = require('../business/user.business');

const { sendResponse, sendError } = require('../utils/responseHandler');

const self = (req, res) =>
  userBusiness.get(req.user._id)
    .then(user => sendResponse(res, user))
    .catch(err => sendError(res, err, 400));

const update = (req, res) => {
  const { body } = req;
  const user = _.pick(body, ['name', 'email', 'role', 'groups', 'short', 'fmcToken']);

  return userBusiness.update(req.user._id, user)
    .then(updatedUser => sendResponse(res, updatedUser))
    .catch(err => sendError(res, err, 400));
};

module.exports = {
  self,
  update,
};
