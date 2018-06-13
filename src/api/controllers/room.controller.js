const { getSearchValues } = require('../models/room.model');
const roomRepository = require('../repositories/RoomRepository');
const RoomBusiness = require('../business/room.business');
const socket = require('../../config/socket');

const { sendResponse, sendError, sendErrorMessage } = require('../utils/responseHandler');
const Logger = require('../utils/logger');

const list = (req, res) => {
  const { query } = req;
  const { id } = req.params;
  const searchValues = getSearchValues(query);

  if (id) {
    const { date, populate } = query;

    return RoomBusiness.listRoomBookings(id, date, populate !== undefined)
      .then(bookings => sendResponse(res, bookings))
      .catch((err) => {
        Logger.error(err);
        return sendError(res, new Error('Get bookings of room failed'), 500);
      });
  }

  if (query.filters !== undefined && query.filters !== null) {
    return RoomBusiness.getFilters(searchValues)
      .then(filters => sendResponse(res, { ...filters }))
      .catch((err) => {
        Logger.error(err);
        return sendError(res, new Error('Get filter failed'), 500);
      });
  }

  if (query.names !== undefined && query.names !== null) {
    return RoomBusiness.getNames(searchValues)
      .then((names) => {
        sendResponse(res, { names });
      })
      .catch((err) => {
        Logger.error(err);
        return sendError(res, new Error('Get names failed'), 500);
      });
  }

  if (query.classes !== undefined && query.classes !== null) {
    return RoomBusiness.getClasses(searchValues)
      .then(classes => sendResponse(res, { classes }))
      .catch((err) => {
        Logger.error(err);
        return sendError(res, new Error('Get groups failed'), 500);
      });
  }

  return RoomBusiness.list(query, searchValues)
    .then(rooms => sendResponse(res, rooms))
    .catch(err => sendError(res, err, 500));
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  return roomRepository.getById(id, populate !== undefined)
    .then(room => sendResponse(res, room))
    .catch(err => sendErrorMessage(res, err, 'Cannot find room', `Room with id: ${id} not found.`));
};

const getByInfoScreen = (req, res) => {
  const { key } = req.headers;
  const { populate } = req.query;

  roomRepository.getByDisplayKey(key, populate !== undefined)
    .then((room) => {
      return sendResponse(res, room);
    })
    .catch((err) => {
      return sendError(res, err, 500);
    });
};


// TODO
const post = (req, res) => {
  // RoomBusiness.createReservation(req.body)
  //   .then((room) => {
  //     socket.sendMessage(room.displayKeys, JSON.stringify({ bookings: room.bookings }));
  //   })
  //   .catch((err) => {
  //     // TODO: LOGGER
  //     console.error(err);
  //   });
  // res.sendStatus(202);
};

module.exports = {
  list,
  get,
  post,
  getByInfoScreen,
};
