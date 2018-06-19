const userRepository = require('../repositories/UserRepository');
const groupRepository = require('../repositories/GroupRepository');

const notificationHandler = require('../utils/notificationHandler');

const Logger = require('../utils/logger');

const get = id =>
  userRepository.getById(id);

const list = () =>
  userRepository.list();

const create = (user) => {
  Logger.info('Create new user.');
  return userRepository.create(user)
    .then((newUser) => {
      Logger.info('New user has been created.');
      if (newUser.groups && newUser.groups.length > 0) {
        Logger.info('New user has groups.');
        return Promise.all(newUser.groups.map(group =>
          groupRepository.addUser(group, newUser.id)))
          .then(() => newUser);
      }
      return newUser;
    });
};

const update = (id, user) =>
  userRepository.update(id, user, false)
    .then((oldUser) => {
      if (user.groups) {
        const newGroups = user.groups.map(a => a.toString());
        const oldGroups = oldUser.groups.map(a => a.toString());
        const removedGroups = oldGroups.filter(group => !newGroups.includes(group));
        const addedGroups = newGroups.filter(group => !oldGroups.includes(group));

        return Promise.all([
          ...removedGroups.map(group => groupRepository.removeUser(group, id)),
          ...addedGroups.map(group => groupRepository.addUser(group, id)),
        ]).then(() => true);
      }
      return true;
    })
    .then(() => userRepository.getById(id))
    .then((newUser) => {
      if (newUser.fmcToken && !(Object.keys(user).length === 1 && user.fmcToken)) {
        notificationHandler.sendToDevice(newUser.fmcToken, 'User', 'User has been updated');
      }

      return newUser;
    });

const remove = id =>
  userRepository.getById(id)
    .then((user) => {
      const { groups } = user;

      return Promise.all(groups.map(group => groupRepository.removeUser(group, id)))
        .then(() => userRepository.remove(id));
    });

module.exports = {
  get,
  list,
  create,
  update,
  remove,
};
