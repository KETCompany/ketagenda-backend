try {
  if(!init) {
    require('../../server');
  }
} catch (err) {
  require('../../server');
}


init = true;



const sinon = require('sinon');
const assert = require('assert');

const business = require('../../src/api/business/user.business');
const groupRepository = require('../../src/api/repositories/GroupRepository');
const notificationHandler = require('../../src/api/utils/notificationHandler');
const Logger = require('../../src/api/utils/Logger');

describe('userGroup tests', () => {
  before(() => {
    sinon
      .stub(notificationHandler, 'sendToDevice')
      .callsFake(() => {
        return {};
      })
    sinon
      .stub(Logger, 'info')
      .callsFake(() => {
      });
  });

  describe('user create and update', () => {
    let createdUserId = '';

    const createUserObject = {
      name: 'test-Daan',
      email: 'test-Daan_donn@hotmail.com',
      role: 'Student',
      short: 'test-d',
    }

    const updateUserObject = {
      name: 'test-Daan-updated',
      email: 'test-Daan_donn@hotmail.com',
      role: 'Student',
      short: 'test-d',
    }

    it('should create a user', () => {
      return business.create(createUserObject)
      .then((user) => {
        createdUserId = user._id;
        assert(user.name === createUserObject.name);
        assert(user.email === createUserObject.email);
        assert(user.role === createUserObject.role);
        assert(user.short === createUserObject.short);
      });
    })

    it('should update the user', () => {
      return business.update(createdUserId, updateUserObject)
        .then((user) => {
          assert(user.name === updateUserObject.name);
          assert(user.email === updateUserObject.email);
          assert(user.role === updateUserObject.role);
          assert(user.short === updateUserObject.short);
        })
    })

    it('should remove the user', () => {
      return business.remove(createdUserId)
        .then((removed) => {
          assert(removed)
        })
    })
  });


  describe('Group create and update', () => {
    let createGroupId = '';

    const createGroupObject = {
      name: 'test-Group',
      description: 'test-group-description',
    };

    const createGroupObjectUpdate = {
      name: 'test-Group2.0',
      description: 'test-group-description2.0',
    };

    it('should create a group', () => {
      return groupRepository.create(createGroupObject)
      .then((group) => {
        createGroupId = group._id;
        assert(group.name === createGroupObject.name);
        return assert(group.description === createGroupObject.description);
      });
    })

    it('should update the group', () => {
      return groupRepository.update(createGroupId, createGroupObjectUpdate)
        .then((group) => {
          assert(group.name === createGroupObjectUpdate.name);
          return assert(group.description === createGroupObjectUpdate.description);
        })
    })

    it('should remove the group', () => {
      return groupRepository.remove(createGroupId)
        .then((removed) => {
          return assert(removed)
        })
    })
  });

  describe('Group create add user', () => {
    let createGroupId = '';
    let createdUserId = '';

    const createUserObject = {
      name: 'test-Daan',
      email: 'test-Daan_donn@hotmail.com',
      role: 'Student',
      short: 'test-d',
    }

    const createGroupObject = {
      name: 'test-Group',
      description: 'test-group-description',
    };

    it('should create a user', () => {
      return business.create(createUserObject)
        .then((user) => {
          createdUserId = user._id;
        });
    })

    it('should create a group', () => {
      return groupRepository.create(createGroupObject)
        .then((group) => {
          createGroupId = group._id;
          assert(group.name === createGroupObject.name);
          return assert(group.description === createGroupObject.description);
        });
    });

    it('should add user to group', () => {
      return groupRepository.addUser(createGroupId, createdUserId)
        .then((res) => {
          return Promise.all([
            groupRepository.getById(createGroupId),
            business.update(createdUserId, { groups: [createGroupId] })
          ]);
        })
        .then(([gr, usr]) => {
          assert(gr.users.length === 1, 'group users length === 1');
          return assert(usr.groups.length === 1, 'user groups length === 1');
        });
    });

    it('should remove user from group', () => {
      return groupRepository.removeUser(createGroupId, createdUserId)
        .then((res) => {
          return Promise.all([
            groupRepository.getById(createGroupId),
            business.update(createdUserId, { groups: [] })
          ]);
        })
        .then(([gr, usr]) => {
          assert(gr.users.length === 0)
          return assert(usr.groups.length === 0)
        });
    });

    it('should add user to group', () => {
      return groupRepository.update(createGroupId, { ...createGroupObject, users: [createdUserId]})
        .then((res) => {
          return groupRepository.getById(createGroupId);
        })
        .then((res) => assert(res.users.length === 1));
    });

    it('should remove user from group', () => {
      return groupRepository.update(createGroupId, { ...createGroupObject, users: []})
        .then((res) => {
          return groupRepository.getById(createGroupId);
        })
        .then((res) => assert(res.users.length === 0));
    });

    it('should remove the group', () => {
      return groupRepository.remove(createGroupId)
        .then((removed) => {
          return assert(removed)
        })
    });
    it('should remove the user', () => {
      return business.remove(createdUserId)
        .then((removed) => {
          assert(removed)
        })
    })
  });



  after(() => {
    Logger.info.restore();
    notificationHandler.sendToDevice.restore();
  });
});
