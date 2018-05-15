const { getSearchValues } = require('../models/room.model');
const roomRepository = require('../repositories/RoomRepository');
const RoomBusiness = require('../business/room.business');
const socket = require('../../config/socket');

const list = (req, res) => {
  const { query } = req;
  const searchValues = getSearchValues(query);
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

  roomRepository.getById(id)
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
  socket.sendMessage('9fmFHDbmWyzlsRrt2lEyNSgKQJ3NibqK');

  //.sendMessage('9fmFHDbmWyzlsRrt2lEyNSgKQJ3NibqK');
  // RoomBusiness.createReservation(req.body).then(console.log).catch((err) => {
  //   console.log(err);
  // });
  res.sendStatus(202);
};

module.exports = {
  list,
  get,
  post,
  getByInfoScreen,
};
