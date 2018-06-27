const _ = require('lodash');

const { getSearchValues } = require('../models/room.model');
const roomRepository = require('../repositories/RoomRepository');
const RoomBusiness = require('../business/room.business');

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
    .catch(err => sendErrorMessage(res, err, 'Cannot find room', `Room with id: ${id} not found.`, 404));
};

const getByInfoScreen = (req, res) => {
  const { key } = req.headers;
  const { populate } = req.query;

  return roomRepository.getByDisplayKey(key, populate !== undefined)
    .then((room) => {
      return sendResponse(res, room);
    })
    .catch((err) => {
      return sendError(res, err, 500);
    });
};

// TODO
const post = (req, res) => {
  const { body } = req;

  const room = _.pick(body, 'department', 'floor', 'type', 'description', 'name', 'number', 'location');

  return roomRepository.create(room)
    .then(savedRoom => sendResponse(res, savedRoom))
    .catch(err => sendError(res, err));
};

const update = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const room = _.pick(body, 'department', 'floor', 'type', 'description', 'name', 'location', 'number', 'displayKeys');

  return roomRepository.update(id, room)
    .then(updatedRoom => sendResponse(res, updatedRoom))
    .catch(err => sendError(res, err));
};

const remove = (req, res) => {
  const { id } = req.params;

  return roomRepository.remove(id)
    .then(() => sendResponse(res, { removed: true }))
    .catch(err => sendError(res, err));
};

module.exports = {
  list,
  get,
  post,
  getByInfoScreen,
  update,
  remove,
};
