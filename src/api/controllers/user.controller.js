// TODO userBuisness
const _ = require('lodash');
const userRepository = require('../repositories/UserRepository');

const list = (req, res) =>
  userRepository.list()
    .then(users => res.json(users));

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return userRepository.getById(id, populate !== undefined)
    .then(user => res.json(user));
};

const create = (req, res) => {
  const { body } = req;

  const {
    name, email, role, group, bookings,
  } = _.pick(body, ['name', 'email', 'role', 'group']);

  const groups = group ? [group] : [];

  return userRepository.create({
    name, email, role, groups,
  })
    .then(() => res.json({ ok: true }));
};

const update = (req, res) => {
  // const newUser = _.pick(body, )
};


module.exports = {
  list,
  get,
  create,
  update,
};
