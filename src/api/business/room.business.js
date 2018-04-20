const {
  Room, mongoQueryBuilder, getSearchValues, mongoProjectionBuilder,
} = require('../models/room.model');

const getFilters = (query) => {
  const searchValues = getSearchValues(query);
  return Promise.all([
    Room.distinct('floor', mongoQueryBuilder(searchValues)),
    Room.distinct('location', mongoQueryBuilder(searchValues)),
    Room.distinct('type', mongoQueryBuilder(searchValues)),
  ]).then(([floors, locations, types]) => {
    const filterLocations = locations
      .map(val => val.toUpperCase())
      .filter((val, i) => locations.indexOf(val) === i);
    const filterTypes = types
      .filter(type => !(/^\w{1,2}\./g).test(type));
    return {
      floors,
      locations: filterLocations,
      types: filterTypes,
    };
  }).catch((err) => {
    // TODO error handling
    console.error(err);
  });
};

const getNames = (query) => {
  const searchValues = getSearchValues(query);
  return Room.distinct('name', mongoQueryBuilder(searchValues))
    .catch((err) => {
      // TODO error handling
      console.error(err);
    });
};

const list = query =>
  Room.find(
    mongoQueryBuilder(getSearchValues(query)),
    mongoProjectionBuilder(query),
  )
    .collation({ locale: 'en', strength: 2 })
    .catch((err) => {
      // TODO error handling
      console.error(err);
    });


module.exports = {
  getFilters,
  list,
  getNames,
};
