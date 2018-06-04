const {
  Booking, mongoQueryBuilder, mongoProjectionBuilder, mongoBookingsQueryBuilder,
} = require('../models/room.model');

const { removeDuplicates, removeRoomNames } = require('../utils/filter');
const { startEndDate } = require('../utils/date');
const roomRepository = require('../repositories/RoomRepository');
const bookingRepository = require('../repositories/BookingRepository');

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


const createReservation = postData =>
  new Promise((resolve, reject) => {
    if (postData.roomId) {
      const booking = new Booking(postData.booking);

      booking.validate((error) => {
        if (error) {
          return reject(error);
        }

        return resolve(roomRepository.insertBooking(postData.roomId, booking));
      });
    } else {
      return reject(new Error('No roomID'));
    }
  });

const list = (query, searchValues) => {
  const mongoQuery = mongoQueryBuilder(searchValues);
  if (!query.time && query.withBookings !== '' && !query.week) {
    return roomRepository.list(mongoQuery, mongoProjectionBuilder(query));
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
  createReservation,
  getClasses,
  listRoomBookings,
};
