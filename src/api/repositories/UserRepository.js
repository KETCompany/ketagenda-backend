const {
  User,
} = require('../models/user.model');

const {
  Group,
} = require('../models/group.model');

const Logger = require('../utils/logger');

const list = () =>
  User.find({})
    .collation({ locale: 'en', strength: 2 });

const listRole = role =>
  User.find({ role })
    .collation({ locale: 'en', strength: 2 });

const listStudents = () => listRole('Student');
const listTeachers = () => listRole('Teacher');

const getById = (id, populate) =>
  User.findById(id)
    .populate(populate ? 'groups' : '')
    .then((user) => {
      if (user) {
        return user;
      }

      throw new Error(`User ${id} not found`);
    });

const create = (body) => {
  const user = new User(body);

  return user.save()
    .then((savedUser) => {
      if (body.groups.length > 0) {
        return Group.findByIdAndUpdate(body.groups[0], { $push: { users: user.id } })
          .then(() => savedUser);
      }

      return savedUser;
    })
    .catch((err) => {
      Logger.error(`${err} - ${JSON.stringify(body)}`);
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
  listStudents,
  listTeachers,
};
