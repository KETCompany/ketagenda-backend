const {
  Group,
} = require('../models/group.model');

const list = () =>
  Group.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Group.findOne({ _id: id })
    .populate(populate ? 'users' : '');

const create = (body) => {
  const group = new Group(body);

  return group.save();
};

module.exports = {
  list,
  getById,
  create,
};
