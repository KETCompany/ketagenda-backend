const {
  User,
} = require('../models/user.model');

const {
  Group,
} = require('../models/group.model');

const { mongoErrorHandler, notFoundHandler } = require('../utils/errorHandler');

const Logger = require('../utils/logger');

const list = () =>
  User.find({})
    .sort({ createdAt: -1 })
    .collation({ locale: 'en', strength: 2 });

const listRole = role =>
  User.find({ role })
    .sort({ createdAt: -1 })
    .collation({ locale: 'en', strength: 2 });

const listStudents = () => listRole('Student');
const listTeachers = () => listRole('Teacher');

const getById = (id, populate) =>
  User.findById(id)
    .populate(populate ? 'groups' : '')
    .then(notFoundHandler(id, 'User'));

const getByGoogleId = id => User.findOne({ googleId: id }).lean();
const getByEmail = email => User.findOne({ email });

const create = (body) => {
  const user = new User(body);

  return user.save()
    .then((savedUser) => {
      if (body.groups && body.groups.length > 0) {
        return Group.findByIdAndUpdate(body.groups[0], { $push: { users: user.id } })
          .then(() => savedUser);
      }
      return savedUser.lean();
    })
    .catch(mongoErrorHandler);
};

const update = (id, body) =>
  User.findByIdAndUpdate(id, body, { new: true }).lean()
    .then(notFoundHandler(id, 'User'))
    .catch(mongoErrorHandler);

const remove = id => {
  // needs to delete in groupe aswell
  return Promise.resolve(id);
}

module.exports = {
  list,
  getById,
  create,
  listStudents,
  listTeachers,
  update,
  remove,
  getByGoogleId,
  getByEmail,
};
