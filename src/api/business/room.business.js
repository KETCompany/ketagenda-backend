const {
  Booking, mongoQueryBuilder, mongoProjectionBuilder, mongoBookingsQueryBuilder,
} = require('../models/room.model');

const { removeDuplicates, removeRoomNames } = require('../utils/filter');
const roomRepository = require('../repositories/RoomRepository');

const getFilters = (searchValues) => {
  const mongoQuery = mongoQueryBuilder(searchValues);

  return roomRepository
    .filters(mongoQuery)
    .then(([floors, resLocations, resTypes]) => {
      const locations = removeDuplicates(resLocations);
      const types = removeRoomNames(resTypes);
      return {
        floors, locations, types,
      };
    });
};

const getNames = (searchValues) => {
  const mongoQuery = mongoQueryBuilder(searchValues);

  return roomRepository.names(mongoQuery);
};

const getClasses = (searchValues) => {
  const mongoQuery = mongoQueryBuilder(searchValues);

  return roomRepository.groups(mongoQuery);
};

const createReservation = (postData) => {
  if (postData.roomId) {
    const booking = new Booking(postData);

    booking.validate(error => Promise.reject(error));

    return roomRepository.insertBooking(postData.roomId, booking);
  }

  return Promise.reject(new Error('No roomID'));
};

const list = (query, searchValues) => {
  const mongoQuery = mongoQueryBuilder(searchValues);
  if (!query.time && query.withBookings !== '' && !query.week) {
    const mongoProjection = mongoProjectionBuilder(query);
    return roomRepository.list(mongoQuery, mongoProjection);
  }

  const mongoBookingsQuery = mongoBookingsQueryBuilder(searchValues);

  return roomRepository.listAdvanced(mongoQuery, mongoBookingsQuery);
};

module.exports = {
  getFilters,
  list,
  getNames,
  createReservation,
  getClasses,
};
