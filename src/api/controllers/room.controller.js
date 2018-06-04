const { getSearchValues } = require('../models/room.model');
const roomRepository = require('../repositories/RoomRepository');
const RoomBusiness = require('../business/room.business');
const socket = require('../../config/socket');

const list = (req, res) => {
  const { query } = req;
  const { id } = req.params;
  const searchValues = getSearchValues(query);

  if (id) {
    const { date, populate } = query;

    return RoomBusiness.listRoomBookings(id, date, populate !== undefined)
      .then(bookings => res.json(bookings));
  }


  if (query.filters !== undefined && query.filters !== null) {
    return RoomBusiness.getFilters(searchValues)
      .then((filters) => {
        res.send({ ...filters });
      });
  }

  if (query.names !== undefined && query.names !== null) {
    return RoomBusiness.getNames(searchValues)
      .then((names) => {
        res.send({ names });
      });
  }

  if (query.classes !== undefined && query.classes !== null) {
    return RoomBusiness.getClasses(searchValues)
      .then(classes => res.send({ classes }));
  }

  return RoomBusiness.list(query, searchValues)
    .then(rooms => res.send(rooms))
    .catch((err) => {
      // TODO error handling
      console.log(err);
    });
};

const get = (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;

  roomRepository.getById(id, populate !== undefined)
    .then((room) => {
      res.send(room);
    })
    .catch((err) => {
      console.error(err);
    });
};

const getByInfoScreen = (req, res) => {
  const { key } = req.params;

  roomRepository.getByKey(key)
    .then((room) => {
      res.send(room);
    })
    .catch((err) => {
      console.error(err);
    });
};

const post = (req, res) => {
  RoomBusiness.createReservation(req.body)
    .then((room) => {
      socket.sendMessage(room.displayKeys, JSON.stringify({ bookings: room.bookings }));
    })
    .catch((err) => {
      // TODO: LOGGER
      console.log(err);
    });
  res.sendStatus(202);
};

module.exports = {
  list,
  get,
  post,
  getByInfoScreen,
};
