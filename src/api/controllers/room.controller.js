const { Room } = require('../models/room.model');
const RoomBusiness = require('../business/room.business');


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
      // TODO ERROR HANDLING
      console.error(err);
    });
};

module.exports = {
  list,
  get,
};
