const sinon = require('sinon');
const assert = require('assert');

const { mongoErrorHandler, notFoundHandler } = require('../../src/api/utils/errorHandler');
const Logger = require('../../src/api/utils/logger');

describe('errorHandler tests', () => {
  before(() => {
    sinon
      .stub(Logger, 'error')
      .callsFake(() => {
      });
  });

  describe('mongoErrorHandler', () => {
    describe('should throw validation Error', () => {
      const error = {
        name: 'ValidationError',
        message: 'ValidationError',
      };
      
      it('error messages are the same', (done) => {
        try {
          mongoErrorHandler(error)
        } catch (err) {
          assert.equal(err.message, error.message);
          done();
        };
      });
    });

    describe('should throw There was a duplicate key error', () => {
      const error = {
        code: 11000
      };
      
      it('error messages are the same', (done) => {
        try {
          mongoErrorHandler(error)
        } catch (err) {
          assert.equal(err.message, 'There was a duplicate key error');
          done();
        };
      });
    })

    describe('should throw There was a duplicate key error', () => {
      const error = {
        name: 'CastError',
        value: 'something',
        kind: 'else',
      };
      
      it('error messages are the same', (done) => {
        try {
          mongoErrorHandler(error)
        } catch (err) {
          assert.equal(err.message, `${error.value} needs to be ${error.kind}`);
          done();
        };
      });
    })

    describe('should throw', () => {
      const error = {

      };
      
      it('error messages are the same', (done) => {
        try {
          mongoErrorHandler(error)
        } catch (err) {
          done();
        };
      });
    })
  })

  describe('notFoundHandler', () => {
    describe('Should throw error not found', () => {
      const object = null

      const id = 13245;
      const field = 'someField';

      it('error messages are the same', (done) => {
        try {
          notFoundHandler(id, field)(object)
        } catch (err) {
          assert.equal(err.message, `${field} with ${id} not found`);
          done();
        };
      });
    });

    describe('Should return the same object', () => {
      const object = {
        foo: 'bar',
      }

      const id = 13245;
      const field = 'someField';

      it('Object is the same as return object', () => {
          const returnObj = notFoundHandler(id, field)(object);
          assert.equal(returnObj, object);
      });
    });
  });

  after(() => {
    Logger.error.restore();
  });
});
