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

const addUser = (id, userId) =>
  Group.findByIdAndUpdate(id, { $push: { users: userId } });

const removeUser = (id, userId) =>
  Group.findByIdAndUpdate(id, { $pull: { users: userId } });

const create = (body) => {
  const group = new Group(body);

  return group.save()
    .then((savedGroup) => {
      if (savedGroup.users) {
        return Promise.all(savedGroup.users.map(id =>
          User.findByIdAndUpdate(id, { $push: { groups: savedGroup.id } })))
          .then(users => ({ ...savedGroup.toJSON(), users }));
      }
      return savedGroup;
    })
    .catch(mongoErrorHandler);
};

const update = (id, body, populate) =>
  Group.findByIdAndUpdate(id, body)
    .then((oldGroup) => {
      if (body.users) {
        const newUsers = body.users.map(a => a.toString());
        const oldUsers = oldGroup.users.map(a => a.toString());
        const removedUsers = oldUsers.filter(group => !newUsers.includes(group));
        const addedUsers = newUsers.filter(group => !oldUsers.includes(group));

        return Promise.all([
          ...removedUsers.map(user => User.findByIdAndUpdate(user, { $pull: { groups: id } })),
          ...addedUsers.map(user => User.findByIdAndUpdate(user, { $push: { groups: id } })),
        ]);
      }
      return true;
    })
    .then(() => Group.findById(id).populate(populate ? 'users' : '')
      .lean())
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

const populate = (obj, key) => Group.populate(obj, key);

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  populate,
  addUser,
  removeUser,
};
