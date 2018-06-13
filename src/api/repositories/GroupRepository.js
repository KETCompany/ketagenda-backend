const {
  Group,
} = require('../models/group.model');

const { mongoErrorHandler, notFoundHandler } = require('../utils/errorHandler');

const list = () =>
  Group.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Group.findById(id)
    .populate(populate ? 'users' : '', '-groups')
    .then(notFoundHandler(id, 'Group'));

const create = (body) => {
  const group = new Group(body);

  return group.save()
    .catch(mongoErrorHandler);
};

const update = (id, body) =>
  Group.findByIdAndUpdate(id, body, { new: true })
    .lean()
    .then(notFoundHandler(id, 'Group'))
    .catch(mongoErrorHandler);

const remove = id =>
  Group.findByIdAndRemove(id)
    .then(notFoundHandler(id, 'Group'))
    .catch(mongoErrorHandler);

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
