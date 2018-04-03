const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const roomSchema = new Schema({
  number: Number,
  department: String,
  floor: Number,
  type: String,
  description: String,
  value: Number,
  name: String,
});

const Room = mongoose.model('Room', roomSchema);

const getSearchValues = (query) => {
  if (query) {
    const searchValues = {};

    if (query.floor) {
      const floors = query.floor.split(',')
        .map(floor => _.toNumber(floor))
        .filter(floor => !_.isNaN(floor));
      if (floors && floors.length > 1) {
        searchValues.floor = floors;
      } else {
        const floor = _.toNumber(query.floor);
        if (!_.isNaN(floor)) {
          searchValues.floor = floor;
        }
      }
    }

    if (query.location) {
      const locations = query.location.split(',');
      if (locations.length > 1) {
        searchValues.location = locations;
      } else {
        searchValues.location = query.location;
      }
    }

    if (query.number) {
      const number = _.toNumber(query.number);
      if (!_.isNaN(number)) {
        searchValues.number = number;
      }
    }

    return { ...searchValues, ..._.pick(query, 'type', 'name', 'withLectures') };
  }
  return {};
};

const mongoQueryBuilder = (searchValues) => {
  const $and = [];
  const mongoQuery = {};

  if (searchValues.name) {
    mongoQuery.name = {
      $regex: new RegExp(searchValues.name, 'i'),
    };
  }

  if (searchValues.floor || _.isNumber(searchValues.floor)) {
    if (searchValues.floor.length > 1) {
      $and.push({
        $or: searchValues.floor.map(floor => ({ floor })),
      });
    } else {
      mongoQuery.floor = searchValues.floor;
    }
  }

  if (searchValues.location) {
    if (_.isArray(searchValues.location)) {
      $and.push({
        $or: searchValues.location.map(location => ({ location })),
      });
    } else {
      mongoQuery.location = searchValues.location;
    }
  }

  if (searchValues.type) {
    mongoQuery.type = {
      $regex: new RegExp(searchValues.type, 'i'),
    };
  }

  if (searchValues.number) {
    mongoQuery.number = searchValues.number;
  }

  if ($and.length > 0) {
    mongoQuery.$and = $and;
  }

  return mongoQuery;
};


module.exports = { Room, getSearchValues, mongoQueryBuilder };
