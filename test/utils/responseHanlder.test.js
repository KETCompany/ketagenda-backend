const sinon = require('sinon');
const assert = require('assert');

const { sendResponse, sendError, sendErrorMessage, sendValidationError } = require('../../src/api/utils/responseHandler');
const Logger = require('../../src/api/utils/logger');

describe('responseHandler tests', () => {
  before(() => {
    sinon
      .stub(Logger, 'error')
      .callsFake(() => {
      });
    sinon
      .stub(Logger, 'info')
      .callsFake(() => {
      });
  });
  describe('sendResponse', () => {
    describe('should send the object', () => {
      const res = {
        status: function(status) { assert.equal(status, 200); return this },
        json: function(object) { return object }
      }

      it('should return with status 200 and object', () => {
        const returnObject = sendResponse(res, { foo: 'bar' });
        assert.deepEqual(returnObject, { foo: 'bar' })
      })
    });
  });

  describe('sendError', () => {
    describe('should send the object', () => {
      const res = {
        status: function (status) { assert.equal(status, 500); return this },
        send: function (error) { return error }
      };

      it('should return a error object with title and description and status: 500', () => {
        const returnObject = sendError(res, { message: 'message', stack: 'stack' });
        assert.deepEqual(returnObject, { title: 'message', description: 'stack' })
      })
    });
    describe('should send the object', () => {
      const res = {
        status: function (status) { assert.equal(status, 400); return this },
        send: function (error) { return error }
      };

      it('should return a error object with title and description and status: 400', () => {
        const returnObject = sendError(res, { message: 'message', stack: 'stack' }, 400);
        assert.deepEqual(returnObject, { title: 'message', description: 'stack' })
      })
    });
  });

  describe('sendErrorMessage', () => {
    describe('should send the object', () => {
      const res = {
        status: function (status) { assert.equal(status, 400); return this },
        send: function (error) { return error }
      };

      const title = 'foo';
      const message = 'bar';
      const status = 400;

      it('should return a error object with title and description and status: 400', () => {
        const returnObject = sendErrorMessage(res, new Error('some error'), title, message, status);
        assert.deepEqual(returnObject, { title, description: message })
      })
    });
    describe('should send the object', () => {
      const res = {
        status: function (status) { assert.equal(status, 500); return this },
        send: function (error) { return error }
      };

      const title = 'foo';
      const message = 'bar';

      it('should return a error object with title and description and status: 400', () => {
        const returnObject = sendErrorMessage(res, new Error('some error'), title, message);
        assert.deepEqual(returnObject, { title, description: message })
      })
    });
  });

  describe('sendValidationError', () => {
    describe('should send the object', () => {
      const res = {
        status: function (status) { assert.equal(status, 400); return this },
        send: function (error) { return error }
      };

      const field = 'title';
      const message = 'Field is required';
      const status = 400;


      it('should return a error object with title and description and status: 400', () => {
        const returnObject = sendValidationError(res, field, message, status);
        assert.deepEqual(returnObject, {
          title: `Validation error: ${field}`,
          description: message
        })
      })
    });
    describe('should send the object', () => {
      const res = {
        status: function (status) { assert.equal(status, 500); return this },
        send: function (error) { return error }
      };

      const field = 'title';
      const message = 'Field is required';


      it('should return a error object with title and description and status: 500', () => {
        const returnObject = sendValidationError(res, field, message);
        assert.deepEqual(returnObject, {
          title: `Validation error: ${field}`,
          description: message
        })
      })
    });
  });

  after(() => {
    Logger.info.restore();
    Logger.error.restore();
  });
});
