const {
  Group,
} = require('../models/group.model');

const {
  User,
} = require('../models/user.model');

const { mongoErrorHandler, notFoundHandler } = require('../utils/errorHandler');

const list = select =>
  Group.find({})
    .select(select)
    .sort({ createdAt: -1 })
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  Group.findById(id)
    .populate(populate ? 'users' : '', '-groups')
    .then(notFoundHandler(id, 'Group'));

const create = (body) => {
  const group = new Group(body);

  return group.save()
    .then((savedGroup) => {
      if (savedGroup.users) {
        return Promise.all(savedGroup.users.map(id =>
          User.findByIdAndUpdate(id, { $push: { groups: savedGroup.id } })));
      }
      return savedGroup;
    })
    .catch(mongoErrorHandler);
};

const update = (id, body) =>
  Group.findByIdAndUpdate(id, body, { new: true })
    .lean()
    .then(notFoundHandler(id, 'Group'))
    .catch(mongoErrorHandler);

const remove = id =>
  Group.findById(id)
    .then((group) => {
      const { users } = group;

      return Promise.all(users.map(user => User.findByIdAndUpdate(user, { $pull: { groups: group.id } })))
        .then(() => group.remove());
    })
    .then(notFoundHandler(id, 'Group'))
    .catch(mongoErrorHandler);

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
