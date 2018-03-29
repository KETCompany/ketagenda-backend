const Room = require('../models/room.model');


const list = (req, res) => {
  const { query } = req;

  const mongoQuery = {};

  if (query.location) {
    mongoQuery.location = {
      $regex: new RegExp(query.location, 'i'),
    };
  }

  if (query.name) {
    mongoQuery.name = {
      $regex: new RegExp(query.name, 'i'),
    };
  }

  if (query.floor) {
    const floor = Number(query.floor);
    if (!Number.isNaN(floor)) {
      mongoQuery.floor = floor;
    }
  }

  if (query.type) {
    mongoQuery.type = {
      $regex: new RegExp(query.type, 'i'),
    };
  }

  if (query.number) {
    const number = Number(query.number);
    if (!Number.isNaN(number)) {
      mongoQuery.number = number;
    }
  }

  Room.find(mongoQuery).then((rooms) => {
    res.send(rooms);
  });
};

const get = (req, res) => {
  const { id } = req.params;

  Room.find({ _id: id })
    .then((room) => {
      res.send(room);
    });
};

module.exports = {
  list,
  get,
};
