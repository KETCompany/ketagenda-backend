const {
  User,
} = require('../models/user.model');

const {
  Group,
} = require('../models/group.model');

const list = () =>
  User.find({})
    .collation({ locale: 'en', strength: 2 });

const getById = (id, populate) =>
  User.findOne({ _id: id })
    .populate(populate ? 'groups' : '');

const create = (body) => {
  const user = new User(body);

  return user.save()
    .then(({ _id }) => {
      if (body.groups.length > 0) {
        return Group.findByIdAndUpdate(body.groups[0], { $push: { users: _id } });
      }

      return true;
    });
};

module.exports = {
  list,
  getById,
  create,
};
