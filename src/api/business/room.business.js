const {
  mongoQueryBuilder, mongoProjectionBuilder, mongoBookingsQueryBuilder,
} = require('../models/room.model');

const bookingRepository = require('../repositories/BookingRepository');

const { removeDuplicates, removeRoomNames } = require('../utils/filter');
const { startEndDate } = require('../utils/date');
const roomRepository = require('../repositories/RoomRepository');

const getFilters = searchValues =>
  roomRepository
    .filters(mongoQueryBuilder(searchValues))
    .then(([floors, resLocations, resTypes]) => {
      const locations = removeDuplicates(resLocations);
      const types = removeRoomNames(resTypes);
      return {
        floors, locations, types,
      };
    });

const getNames = searchValues =>
  roomRepository.names(mongoQueryBuilder(searchValues));

const getClasses = searchValues =>
  roomRepository.groups(mongoQueryBuilder(searchValues));

const list = (query, searchValues) => {
  const mongoQuery = mongoQueryBuilder(searchValues);
  if (!query.time && query.withBookings !== '' && !query.week) {
    return roomRepository.list(mongoQuery, mongoProjectionBuilder(query)).lean()
      .then(rooms =>
        bookingRepository.listNow()
          .then((bookings) => {
            const occupiedRooms = bookings.map(booking => booking.room);
            return rooms.map(room => ({
              ...room,
              occupied: occupiedRooms.includes(room.id),
            }));
          }));
  }

  return roomRepository.listAdvanced(mongoQuery, mongoBookingsQueryBuilder(searchValues));
};

const listRoomBookings = (id, date, populate) => {
  const { start, end } = startEndDate(date);

  return bookingRepository.getByRoomId(id, start, end, populate);
};

module.exports = {
  getFilters,
  list,
  getNames,
  // createReservation,
  getClasses,
  listRoomBookings,
};
