const sinon = require('sinon');
const assert = require('assert');

const controller = require('../../src/api/controllers/event.controller');
const eventRepository = require('../../src/api/repositories/EventRepository');
const eventBusiness = require('../../src/api/business/event.business');

const responseHandler = require('../../src/api/utils/responseHandler');
const Logger = require('../../src/api/utils/logger');

describe('event.controller tests', () => {
  before(() => {
    sinon
      .stub(Logger, 'info')
      .callsFake(() => {});
    
    sinon
      .stub(responseHandler, 'sendResponse')
      .callsFake(() => {
        return true;
      });
    sinon
      .stub(responseHandler, 'sendError')
      .callsFake(() => {
        return false;
      });
    sinon
      .stub(responseHandler, 'sendErrorMessage')
      .callsFake(() => {
        return false;
      });
  });

  describe('Get tests', () => {
    before(() => {
      sinon
        .stub(eventRepository, 'getById')
        .callsFake((id, populate) => {
          if (!id) {
            return Promise.reject('err');
          }
          return Promise.resolve({ id, populate });
        })
    })
    it('get without params should give a error', (done) => {
      try {
        controller.get({}, {})
      } catch(err) {
        done();
      }
    });

    it('get with params is valid', () => {
      const params = {
        id: '1234'
      };
      const query = {

      };
      return controller.get({ params, query }, null)
        .then((res) => {
          return assert.equal(res, true);
        })
    });

    it('get without id gives error', () => {
      const params = {
        
      };
      const query = {

      };
      return controller.get({ params, query }, null)
        .then((res) => {
          return assert.equal(res, false);
        })
    });
  })

  describe('List test', () => {
    before(() => {
      sinon
        .stub(eventBusiness, 'listEventBookings')
        .callsFake((id) => {
          if(id === 'not exist') {
            return Promise.reject();
          }
          return Promise.resolve({ id });
        });
      sinon
        .stub(eventBusiness, 'listEvents')
        .callsFake((id, populate) => {
          return Promise.resolve({ id, populate })
        });
    });

    describe('with id', () => {
      const params = {
        id: '1234'
      };
      const query = {

      };

      it('should not give a error', () => {
        return controller.list({ params, query }, null)
          .then(res => {
            return assert.notEqual(res, false);
          })
      });
    })
    describe('without id', () => {
      const params = {
      };
      const query = {
      };

      it('should not give a error', () => {
        return controller.list({ params, query }, null)
          .then(res => {
            return assert.notEqual(res, false);
          })
      });
    })
    describe('with id not exist', () => {
      const params = {
        id: 'not exist',
      };
      const query = {
      };

      it('should give an error', () => {
        return controller.list({ params, query }, null)
          .then(res => assert.equal(res, false));
      });
    })

    after(() => {
      eventBusiness.listEvents.restore();
      eventBusiness.listEventBookings.restore();
    })
  });

// // // // // // //
// CREATION TEST //
// // // // // // //

  describe('Create test', () => {
    before(() => {
      sinon
        .stub(responseHandler, 'sendValidationError')
        .callsFake((id, name, message) => {
          return Promise.resolve({ name, message });
        });
        
      sinon
        .stub(eventRepository, 'create')
        .callsFake(({ name }) => {
          if (name === 'error') {
            return Promise.reject('err');
          }

          return Promise.resolve();
        });

      sinon
        .stub(eventBusiness, 'create')
        .callsFake(({ name }) => {
          if (name === 'error') {
            return Promise.reject('err');
          }

          return Promise.resolve();
        });
    });

    describe('with everything', () => {
      const req = {
        body: {
          name: 'name',
          description: 'something',
          owner: 'something',
          groups: 'something',
          subscribers: 'something',
          bookings: 'something',
        },
      };

      it('should not give a error', () => {
        return controller.create(req, null)
          .then(res => {
            return assert.notEqual(res, false);
          })
      });
    })

    describe('name missing', () => {
      const req = {
        body: {
          description: 'something',
          owner: 'something',
          groups: 'something',
          subscribers: 'something',
          bookings: 'something',
        }
      }

      it('should give a error about name', () => {
        return controller.create(req, null)
          .then(res => {
            return assert.equal(res.message, 'Name is required');
          })
      });
    })
    describe('with error', () => {
      const req = {
        body: {
          name: 'error',
          description: 'something',
          owner: 'something',
          groups: 'something',
          subscribers: 'something',
          bookings: 'something',
        }
      }

      it('should give in create error', () => {
        return controller.create(req, null)
          .then(res => {
            return assert.equal(res, false);
          });
      });
    });

    after(() => {
      eventRepository.create.restore();
      eventBusiness.create.restore();
    });
  });

// // // // // // //
// UPDATE TEST //
// // // // // // //

  describe('Update test', () => {
    before(() => {
      sinon
        .stub(eventBusiness, 'update')
        .callsFake((id, { name }) => {
          if(name === 'error') {
            return Promise.reject('err');
          }

          return Promise.resolve();
        })
    });

    describe('with everything', () => {
      const req = {
        params: {
          id: 1234
        },
        body: {
          name: 'name',
          description: 'something',
        }
      }

      it('should not give a error', () => {
        return controller.update(req, null)
          .then(res => {
            assert.notEqual(res, false);
          })
      });
    })

    describe('with error', () => {
      const req = {
        params: {
          id: 1234
        },
        body: {
          name: 'error',
          description: 'something',
        }
      }

      it('should give in create error', () => {
        return controller.update(req, null)
          .then(res => {
            return assert.equal(res, false);
          });
      });
    });

    after(() => {
      eventBusiness.update.restore();
    })
  });

  after(() => {
    responseHandler.sendResponse.restore();
    responseHandler.sendError.restore();
    responseHandler.sendErrorMessage.restore();
    responseHandler.sendValidationError.restore();
    Logger.info.restore();
  });
});
