const { Room, mongoQueryBuilder, getSearchValues } = require('../models/room.model');
const _ = require('lodash');

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
    return {
      floors,
      locations: filterLocations,
      types,
    };
  }).catch((err) => {
    // TODO error handling
    console.error(err);
  });
};

const list = query =>
  Room.find(
    mongoQueryBuilder(getSearchValues(query)),
    query.withBookings === undefined ? { booked: 0 } : {},
  )
    .collation({ locale: 'en', strength: 2 })
    .catch((err) => {
      // TODO error handling
      console.error(err);
    });


module.exports = {
  getFilters,
  list,
};
