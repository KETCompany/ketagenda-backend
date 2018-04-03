
const { assert } = require('chai');
const _ = require('lodash');

// Room.getSearchValues();

describe('Room', () => {
  describe('getSearchValues', () => {
    describe('floor with string as param', () => {
      const queryParams = {
        floor: 'a'
      }
      const searchValues = getSearchValues(queryParams)

      it('should not have floor', () => {
        assert.isUndefined(searchValues.floor);
      })
    })
    describe('floor with int as param', () => {
      const queryParams = {
        floor: '1'
      }
      const searchValues = getSearchValues(queryParams)

      it('should not have floor', () => {
        assert.isDefined(searchValues.floor);
        assert.isNumber(searchValues.floor);
        assert.isNotNaN(searchValues.floor);
      })
    })
    describe('floor with multiple ints as param', () => {
      const queryParams = {
        floor: '1,2a,3,4,a'
      }
      const searchValues = getSearchValues(queryParams)

      it('should not have floor', () => {
        assert.isDefined(searchValues.floor);
        assert.isArray(searchValues.floor);
        assert.isTrue(searchValues.floor.every(i => _.isNumber(i)));
      })
    })

    describe('floor location type and name', () => {
      const queryParams = {
        floor: '1',
        location: 'H',
        type: 'Some type',
        name: 'Some name'
      }
      const searchValuesPropper = {
        floor: 1,
        location: 'H',
        type: 'Some type',
        name: 'Some name'
      }
      const searchValues = getSearchValues(queryParams);
      it('should be the same as', () => {
        assert.deepEqual(searchValues, searchValuesPropper);
      })
    })
    
    describe('floor type and name', () => {
      const queryParams = {
        floor: '1',
        locations: 'H',
        type: 'Some type',
        name: 'Some name'
      }
      const searchValuesPropper = {
        floor: 1,
        type: 'Some type',
        name: 'Some name'
      }
      const searchValues = getSearchValues(queryParams);
      it('should be the same as', () => {
        assert.deepEqual(searchValues, searchValuesPropper);
      })
    })


  })
});

describe.only('mongo', () => {
  describe('only name', () => {
    const searchValues = {
      name: 'something',
    }
    const expectedValue = {
      name: {
        $regex: new RegExp('something', 'i'),
      }
    }
    const mongoQuery = mongoQueryBuilder(searchValues);
    it('should return', () => {
      assert.deepEqual(mongoQuery, expectedValue);
    })
  })

  describe('floor', () => {
    describe('one floor', () => {
      const searchValues = {
        floor: 1
      }
      const expectedValue = {
       floor:1
      };

      const mongoQuery = mongoQueryBuilder(searchValues);
      it('should return', () => {
        assert.deepEqual(mongoQuery, expectedValue);
      })
    })
    describe('floors', () => {
      const searchValues = {
        floor: [1, 2, 3],
        name: 'lol'
      }
      const expectedValue = {
        $and: [
          {
            $or: [
              { floor: 1 },
              { floor: 2 },
              { floor: 3 },
            ]
          }
        ],
        name: {
          $regex: new RegExp('lol', 'i'),
        }
      };

      const mongoQuery = mongoQueryBuilder(searchValues);
      it('should return', () => {
        assert.deepEqual(mongoQuery, expectedValue);
      })
    })
  })


  describe('location', () => {
    describe('one location', () => {
      const searchValues = {
        location: 'H'
      }
      const expectedValue = {
       location: 'H'
      };

      const mongoQuery = mongoQueryBuilder(searchValues);
      it('should return', () => {
        assert.deepEqual(mongoQuery, expectedValue);
      })
    })
    describe('locations', () => {
      const searchValues = {
        location: ['H', 'WD'],
        name: 'lol'
      }
      const expectedValue = {
        $and: [
          {
            $or: [
              { location: 'H' },
              { location: 'WD' },
            ]
          }
        ],
        name: {
          $regex: new RegExp('lol', 'i'),
        }
      };

      const mongoQuery = mongoQueryBuilder(searchValues);
      it('should return', () => {
        assert.deepEqual(mongoQuery, expectedValue);
      })
    })
  })

  describe('locations and floors', () => {
    const searchValues = {
      location: ['H', 'WD'],
      floor: [1, 2, 3],
      name: 'lol'
    }
    const expectedValue = {
      $and: [
        {
          $or: [
            { floor: 1 },
            { floor: 2 },
            { floor: 3 },
          ]
        },
        {
          $or: [
            { location: 'H' },
            { location: 'WD' },
          ]
        }
      ],
      name: {
        $regex: new RegExp('lol', 'i'),
      }
    };

    const mongoQuery = mongoQueryBuilder(searchValues);
    it('should return', () => {
      assert.deepEqual(mongoQuery, expectedValue);
    })
  })
})