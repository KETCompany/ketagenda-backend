const sinon = require('sinon');
const assert = require('assert');

const controller = require('../../src/api/controllers/group.controller');
const eventRepository = require('../../src/api/repositories/EventRepository');
const eventBusiness = require('../../src/api/business/event.business');

const groupRepository = require('../../src/api/repositories/GroupRepository');

const responseHandler = require('../../src/api/utils/responseHandler');
const Logger = require('../../src/api/utils/logger');
const notificationHandler = require('../../src/api/utils/notificationHandler');

describe('event.controller tests', () => {
  before(() => {
    sinon
      .stub(Logger, 'info')
      .callsFake(() => { });

    sinon
      .stub(responseHandler, 'sendResponse')
      .callsFake(() => true);
    sinon
      .stub(responseHandler, 'sendError')
      .callsFake(() => false);
    sinon
      .stub(responseHandler, 'sendErrorMessage')
      .callsFake(() => false);
  });

  describe('Get tests', () => {
    before(() => {
      sinon
        .stub(groupRepository, 'getById')
        .callsFake((id, populate) => {
          if (!id) {
            return Promise.reject('err');
          }
          return Promise.resolve({ id, populate });
        });

      sinon
        .stub(eventRepository, 'getByGroupId')
        .callsFake((id, populate) => {
          if (!id) {
            return Promise.reject('err');
          }
          return Promise.resolve({ id, populate });
        });
    });

    after(() => {
      groupRepository.getById.restore();
      eventRepository.getByGroupId.restore();
    });

    it('get without params should give a error', (done) => {
      try {
        controller.get({}, {});
      } catch (err) {
        done();
      }
    });

    it('get with params is valid', () => {
      const params = {
        id: '1234',
      };
      const query = {

      };
      return controller.get({ params, query }, null)
        .then(res => assert.equal(res, true));
    });

    it('get without id gives error', () => {
      const params = {

      };
      const query = {

      };
      return controller.get({ params, query }, null)
        .then(res => assert.equal(res, false));
    });
  });

  describe('List test', () => {
    before(() => {
      sinon
        .stub(groupRepository, 'list')
        .callsFake((id) => {
          if (id && id[0] === 'id') {
            return Promise.reject();
          }
          return Promise.resolve({ id });
        });
      sinon
        .stub(eventBusiness, 'listEvents')
        .callsFake((id, populate) => Promise.resolve({ id, populate }));
    });

    describe('with id', () => {
      const params = {
        id: '1234',
      };
      const query = {

      };

      it('should not give a error', () => controller.list({ params, query }, null)
        .then(res => assert.notEqual(res, false)));
    });
    describe('without id', () => {
      const params = {
      };
      const query = {
      };

      it('should not give a error', () => controller.list({ params, query }, null)
        .then(res => assert.notEqual(res, false)));
    });
    describe('with id not exist', () => {
      const params = {

      };
      const query = {
        select: 'id',
      };

      it('should give an error', () => controller.list({ params, query }, null)
        .then(res => assert.equal(res, false)));
    });

    after(() => {
      groupRepository.list.restore();
    });
  });

  // // // // // // //
  // CREATION TEST //
  // // // // // // //

  describe('Create test', () => {
    before(() => {
      sinon
        .stub(responseHandler, 'sendValidationError')
        .callsFake((id, name, message) => Promise.resolve({ name, message }));
      sinon
        .stub(notificationHandler, 'sendToGroup')
        .callsFake(() => Promise.resolve({}));
      sinon
        .stub(groupRepository, 'create')
        .callsFake(({ name }) => {
          if (name === 'error') {
            return Promise.reject('err');
          }

          return Promise.resolve({ _id: 1234 });
        });
    });

    describe('with everything', () => {
      const req = {
        body: {
          name: 'name',
          description: 'something',
        },
      };

      it('should not give a error', () => controller.create(req, null)
        .then(res => assert.notEqual(res, false)));
    });

    describe('name missing', () => {
      const req = {
        body: {
          description: 'something',
          owner: 'something',
        },
      };

      it('should give a error about name', () => controller.create(req, null)
        .then((res) => assert.equal(res.message, 'Name is required')));
    });
    describe('with error', () => {
      const req = {
        body: {
          name: 'error',
          description: 'something',
        },
      };

      it('should give in create error', () => controller.create(req, null)
        .then((res) => assert.equal(res, false)));
    });

    after(() => {
      groupRepository.create.restore();
      notificationHandler.sendToGroup.restore();
    });
  });

  // // // // // // //
  // UPDATE TEST //
  // // // // // // //

  describe('Update test', () => {
    before(() => {
      sinon
        .stub(groupRepository, 'update')
        .callsFake((id, { name }) => {
          if (name === 'error') {
            return Promise.reject('err');
          }

          return Promise.resolve({ name: 'something' });
        });
      sinon
        .stub(notificationHandler, 'sendToGroup')
        .callsFake(() => Promise.resolve({}));
    });

    describe('with everything', () => {
      const req = {
        params: {
          id: 1234,
        },
        body: {
          name: 'name',
          description: 'something',
        },
      };

      it('should not give a error', () => controller.update(req, null)
        .then((res) => {
          assert.notEqual(res, false);
        }));
    });

    describe('with error', () => {
      const req = {
        params: {
          id: 1234,
        },
        body: {
          name: 'error',
          description: 'something',
        },
      };

      it('should give in create error', () => controller.update(req, null)
        .then((res) => assert.equal(res, false)));
    });

    after(() => {
      groupRepository.update.restore();
      notificationHandler.sendToGroup.restore();
    });
  });

  after(() => {
    responseHandler.sendResponse.restore();
    responseHandler.sendError.restore();
    responseHandler.sendErrorMessage.restore();
    responseHandler.sendValidationError.restore();
    Logger.info.restore();
  });
});
