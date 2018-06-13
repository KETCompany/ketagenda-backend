const {
  Group,
} = require('../models/group.model');

const Logger = require('../utils/logger');

const list = () =>
  Group.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Group.findById(id)
    .populate(populate ? 'users' : '', '-groups')
    .then((group) => {
      if (group) {
        return group;
      }

      throw new Error(`Group ${id} not found`);
    });

const create = (body) => {
  const group = new Group(body);

  return group.save()
    .catch((err) => {
      Logger.error(err);

      if (err.name === 'ValidationError') {
        throw new Error(err.message);
      }

      if (err.code === 11000) {
        throw new Error('There was a duplicate key error');
      }

      throw err;
    });
};

module.exports = {
  list,
  getById,
  create,
};
