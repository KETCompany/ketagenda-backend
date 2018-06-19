const {
  User,
} = require('../models/user.model');

const { mongoErrorHandler, notFoundHandler } = require('../utils/errorHandler');

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

const addGroup = (id, groupId) =>
  User.findByIdAndUpdate(id, { $push: { groups: groupId } });

const removeGroup = (id, groupId) =>
  User.findByIdAndUpdate(id, { $pull: { groups: groupId } });

const create = (body) => {
  const user = new User(body);

  return user.save()
    .catch(mongoErrorHandler);
};

const update = (id, body, newReturn = false) =>
  User.findByIdAndUpdate(id, body, { new: newReturn })
    .then(notFoundHandler(id, 'User'))
    .catch(mongoErrorHandler);

const remove = id =>
  User.findByIdAndRemove(id)
    .then(notFoundHandler(id, 'User'))
    .catch(mongoErrorHandler);


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
  removeGroup,
  addGroup,
};
