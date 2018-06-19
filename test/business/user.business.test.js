const sinon = require('sinon');
const assert = require('assert');

const business = require('../../src/api/business/user.business');
const userRepository = require('../../src/api/repositories/UserRepository');
const groupRepository = require('../../src/api/repositories/GroupRepository');
const notificationHandler = require('../../src/api/utils/notificationHandler');
const Logger = require('../../src/api/utils/Logger');

describe('user.business tests', () => {
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

  describe('Get tests', () => {
    before(() => {
      sinon
        .stub(userRepository, 'getById')
        .callsFake(() => {
          return Promise.resolve(true);
        });
    })

    it('should return true', () => {
      return business.get(12345)
        .then((res) => {
          return assert.equal(res, true);
        })
    })

    after(() => {
      userRepository.getById.restore();
    });
    
  });

  describe('List test', () => {
    before(() => {
      sinon
        .stub(userRepository, 'list')
        .callsFake(() => {
          return Promise.resolve(true);
        });
    })

    it('should return true', () => {
      return business.list()
        .then((res) => {
          return assert.equal(res, true);
        })
    })

    after(() => {
      userRepository.list.restore();
    });
  });


  describe('Create test', () => {
    before(() => {
      sinon
        .stub(userRepository, 'create')
        .callsFake((user) => {
          return Promise.resolve(user);
        });

      sinon
        .stub(groupRepository, 'addUser')
        .callsFake((user) => {
          return Promise.resolve(user);
        });
    })

    it('user should be the same', () => {
      const user = { name: 'name', email: 'email' };

      return business.create(user)
        .then((res) => {
          return assert.equal(res, user);
        })
    })

    it('should ignore the empty group array', () => {
      const user = { name: 'name', email: 'email', groups: [] };

      return business.create(user)
        .then((res) => {
          return assert.equal(res, user);
        })
    });

    it('should ignore the empty group array', () => {
      const user = { id: 'something', name: 'name', email: 'email', groups: ['a', 'b', 'c'] };

      return business.create(user)
        .then((res) => {
          return assert.equal(res, user);
        })
    })


    after(() => {
      userRepository.create.restore();
      groupRepository.addUser.restore();
    });
  });

  describe('Create test errors', () => {
    describe('Create test error [1]', () => {
      before(() => {
        sinon
          .stub(userRepository, 'create')
          .callsFake((user) => {
            return Promise.reject(new Error());
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.reject(new Error());
          });
      })

      it('should give an error', () => {
        const user = { name: 'name', email: 'email' };

        return business.create(user)
          .catch(err => assert.equal(err instanceof Error, true))
      })

      after(() => {
        userRepository.create.restore();
        groupRepository.addUser.restore();
      });
    })

    describe('Create test errors [2]', () => {
      before(() => {
        sinon
          .stub(userRepository, 'create')
          .callsFake((user) => {
            return Promise.resolve(user);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.reject(new Error());
          });
      })

      it('should use the groups and give error', () => {
        const user = { id: 'something', name: 'name', email: 'email', groups: ['a', 'b', 'c'] };

        return business.create(user)
          .catch(err => assert.equal(err instanceof Error, true))
      })

      after(() => {
        userRepository.create.restore();
        groupRepository.addUser.restore();
      });
      
    });
  });




  describe('Update test', () => {
    describe('update flow (1) without groups and without fmcToken', () => {
      before(() => {
        const oldUser = { name: 'oldName', email: 'email' }
        const newUser = { name: 'name', email: 'email' }
        sinon
          .stub(userRepository, 'update')
          .callsFake((id, user) => {
            return Promise.resolve(oldUser);
          });
        sinon
          .stub(userRepository, 'getById')
          .callsFake((id) => {
            return Promise.resolve(newUser);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
        sinon
          .stub(groupRepository, 'removeUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
      })

      it('user should be the same', () => {
        const user = { name: 'name', email: 'email' };
        const id = 1234;
        return business.update(id, user)
          .then((res) => {
            assert(notificationHandler.sendToDevice.notCalled)
            return assert.deepEqual(res, user);
          })
      })

      after(() => {
        userRepository.update.restore();
        userRepository.getById.restore();
        groupRepository.addUser.restore();
        groupRepository.removeUser.restore();
      });
    });

    describe('update flow (2) without groups and with fmcToken', () => {
      before(() => {
        const oldUser = { name: 'oldName', email: 'email', fmcToken: 'test' }
        const newUser = { name: 'name', email: 'email', fmcToken: 'test' }
        sinon
          .stub(userRepository, 'update')
          .callsFake((id, user) => {
            return Promise.resolve(oldUser);
          });
        sinon
          .stub(userRepository, 'getById')
          .callsFake((id) => {
            return Promise.resolve(newUser);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
        sinon
          .stub(groupRepository, 'removeUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
      });

      it('user should be the same', () => {
        const user = { name: 'name', email: 'email', fmcToken: 'test' };
        const id = 1234;
        return business.update(id, user)
          .then((res) => {
            assert(notificationHandler.sendToDevice.calledOnce)
            return assert.deepEqual(res, user);
          })
      })

      after(() => {
        userRepository.update.restore();
        userRepository.getById.restore();
        groupRepository.addUser.restore();
        groupRepository.removeUser.restore();
        notificationHandler.sendToDevice.reset();
      });
    });

    describe('update flow (3) without groups and with only fmcToken', () => {
      before(() => {
        const oldUser = { fmcToken: 'test' }
        const newUser = { fmcToken: 'test' }
        sinon
          .stub(userRepository, 'update')
          .callsFake((id, user) => {
            return Promise.resolve(oldUser);
          });
        sinon
          .stub(userRepository, 'getById')
          .callsFake((id) => {
            return Promise.resolve(newUser);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
        sinon
          .stub(groupRepository, 'removeUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
      });

      it('user should be the same', () => {
        const user = { fmcToken: 'test' };
        const id = 1234;
        return business.update(id, user)
          .then((res) => {
            
            assert(notificationHandler.sendToDevice.notCalled)
            return assert.deepEqual(res, user);
          })
      })

      after(() => {
        userRepository.update.restore();
        userRepository.getById.restore();
        groupRepository.addUser.restore();
        groupRepository.removeUser.restore();
      });
    });

    describe('update flow (4) with groups (1)', () => {
      before(() => {
        const groups = ['a', 'b', 'c']
        const oldUser = { name: 'oldName', email: 'email', fmcToken: 'test', groups }
        const newUser = { name: 'name', email: 'email', fmcToken: 'test', groups: [] }
        sinon
          .stub(userRepository, 'update')
          .callsFake((id, user) => {
            return Promise.resolve(oldUser);
          });
        sinon
          .stub(userRepository, 'getById')
          .callsFake((id) => {
            return Promise.resolve(newUser);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
        sinon
          .stub(groupRepository, 'removeUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
      });

      it('user should be the same', () => {
        const user = { name: 'name', email: 'email', fmcToken: 'test', groups: [] };
        const id = 1234;
        return business.update(id, user)
          .then((res) => {
            assert(groupRepository.removeUser.callCount === 3)
            return assert.deepEqual(res, user);
          })
      })

      after(() => {
        userRepository.update.restore();
        userRepository.getById.restore();
        groupRepository.addUser.restore();
        groupRepository.removeUser.restore();
      });
    });

    describe('update flow (5) with groups (2)', () => {
      before(() => {
        const groups = ['a', 'b', 'c']
        const oldUser = { name: 'oldName', email: 'email', fmcToken: 'test', groups }
        const newUser = { name: 'name', email: 'email', fmcToken: 'test', groups: ['c'] }
        sinon
          .stub(userRepository, 'update')
          .callsFake((id, user) => {
            return Promise.resolve(oldUser);
          });
        sinon
          .stub(userRepository, 'getById')
          .callsFake((id) => {
            return Promise.resolve(newUser);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
        sinon
          .stub(groupRepository, 'removeUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
      });

      it('user should be the same', () => {
        const user = { name: 'name', email: 'email', fmcToken: 'test', groups: ['c'] };
        const id = 1234;
        return business.update(id, user)
          .then((res) => {
            assert(groupRepository.removeUser.callCount === 2)
            assert(groupRepository.addUser.callCount === 0)
            return assert.deepEqual(res, user);
          })
      })

      after(() => {
        userRepository.update.restore();
        userRepository.getById.restore();
        groupRepository.addUser.restore();
        groupRepository.removeUser.restore();
      });
    });

    describe('update flow (5) with groups (3)', () => {
      before(() => {
        const groups = ['a', 'b', 'c']
        const oldUser = { name: 'oldName', email: 'email', fmcToken: 'test', groups }
        const newUser = { name: 'name', email: 'email', fmcToken: 'test', groups: ['c', 'f'] }
        sinon
          .stub(userRepository, 'update')
          .callsFake((id, user) => {
            return Promise.resolve(oldUser);
          });
        sinon
          .stub(userRepository, 'getById')
          .callsFake((id) => {
            return Promise.resolve(newUser);
          });

        sinon
          .stub(groupRepository, 'addUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
        sinon
          .stub(groupRepository, 'removeUser')
          .callsFake((user) => {
            return Promise.resolve(user);
          });
      });

      it('user should be the same', () => {
        const user = { name: 'name', email: 'email', fmcToken: 'test', groups: ['c', 'f'] };
        const id = 1234;
        return business.update(id, user)
          .then((res) => {
            assert(groupRepository.removeUser.callCount === 2)
            assert(groupRepository.addUser.callCount === 1)
            return assert.deepEqual(res, user);
          })
      })

      after(() => {
        userRepository.update.restore();
        userRepository.getById.restore();
        groupRepository.addUser.restore();
        groupRepository.removeUser.restore();
      });
    });


    describe('Remove test', () => {
      describe('remove flow (1) without groups and with groups', () => {
        before(() => {
          const user = { name: 'oldName', email: 'email', groups: ['1', '2'] }
          sinon
            .stub(userRepository, 'remove')
            .callsFake((id, user) => {
              return Promise.resolve(true);
            });
          sinon
            .stub(userRepository, 'getById')
            .callsFake((id) => {
              return Promise.resolve(user);
            });
   
          sinon
            .stub(groupRepository, 'removeUser')
            .callsFake((user) => {
              return Promise.resolve(user);
            });
        })

        it('user should be the same', () => {
          return business.remove('100')
            .then((res) => {
              assert(groupRepository.removeUser.callCount === 2)
              return assert.deepEqual(res, true);
            })
        })

        after(() => {
          userRepository.remove.restore();
          userRepository.getById.restore();
          groupRepository.removeUser.restore();
        });
      });

      describe('remove flow (1) without groups and without groups', () => {
        before(() => {
          const user = { name: 'oldName', email: 'email', groups: [] }
          sinon
            .stub(userRepository, 'remove')
            .callsFake((id, user) => {
              return Promise.resolve(true);
            });
          sinon
            .stub(userRepository, 'getById')
            .callsFake((id) => {
              return Promise.resolve(user);
            });
   
          sinon
            .stub(groupRepository, 'removeUser')
            .callsFake((user) => {
              return Promise.resolve(user);
            });
        })

        it('user should be the same', () => {
          return business.remove('100')
            .then((res) => {
              assert(groupRepository.removeUser.callCount === 0)
              return assert.deepEqual(res, true);
            })
        })

        after(() => {
          userRepository.remove.restore();
          userRepository.getById.restore();
          groupRepository.removeUser.restore();
        });
      });
    });
  });






  after(() => {
    Logger.info.restore();
    notificationHandler.sendToDevice.restore();
  });
});
