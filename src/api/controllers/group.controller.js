const _ = require('lodash');
const groupRepository = require('../repositories/GroupRepository');
// const groupBuisness = require('../business/group.business');

const list = (req, res) => {
  const { query } = req;

  return groupRepository.list()
    .then(groups => res.send(groups))
    .catch(err => console.log(err));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return groupRepository.getById(id, populate !== undefined)
    .then((group) => {
      res.send(group);
    })
    .catch((err) => {
      console.error(err);
    });
};

const create = (req, res) => {
  const { body } = req;

  const group = _.pick(body, 'name', 'description');

  return groupRepository.create(group)
    .then(response => res.json(response));
};

const update = (req, res) => {

};

module.exports = {
  list,
  get,
  create,
  update,
};
