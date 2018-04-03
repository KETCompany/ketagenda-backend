const { Room } = require('../models/room.model');
const RoomBusiness = require('../business/room.business');


const list = (req, res) => {
  if (req.query.filters !== undefined && req.query.filters !== null) {
    return RoomBusiness.getFilters(req.query)
      .then((filters) => {
        res.send({ ...filters });
      });
  }

  return RoomBusiness.list(req.query)
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
