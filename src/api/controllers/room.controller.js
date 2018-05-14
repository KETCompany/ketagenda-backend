const { Room } = require('../models/room.model');
const RoomBusiness = require('../business/room.business');
const socket = require('../../config/socket');

const list = (req, res) => {
  const { query } = req;
  if (query.filters !== undefined && query.filters !== null) {
    return RoomBusiness.getFilters(query)
      .then((filters) => {
        res.send({ ...filters });
      });
  }

  if (query.names !== undefined && query.names !== null) {
    return RoomBusiness.getNames(query)
      .then((names) => {
        res.send({ names });
      });
  }

  return RoomBusiness.list(query)
    .then(rooms => res.send(rooms))
    .catch((err) => {
      // TODO error handling
      console.log(err);
    });
};

const get = (req, res) => {
  const { id } = req.params;

  Room.find({ _id: id })
    .then((room) => {
      res.send(room);
    })
    .catch((err) => {
      console.error(err);
    });
};

const getByInfoScreen = (req, res) => {
  const { key } = req.params;

  Room.find({ infoScreenKeys: key })
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
