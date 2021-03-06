const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

const { Schema } = mongoose;


const roomSchema = new Schema({
  number: Number,
  department: String,
  location: String,
  floor: Number,
  type: String,
  description: String,
  value: Number,
  name: { type: String, unique: true },
  displayKeys: [String],
}, {
  strict: 'throw',
  useNestedStrict: true,
  timestamps: true,
});

roomSchema.virtual('bookings', {
  ref: 'bookings',
  localField: '_id',
  foreignField: 'room',
});

roomSchema.set('toObject', { virtuals: true });
roomSchema.set('toJSON', { virtuals: true });


let Room;
try {
  Room = mongoose.model('rooms');
} catch (e) {
  Room = mongoose.model('rooms', roomSchema);
}

const getSearchValues = (query) => {
  if (query) {
    const searchValues = {};

    if (query.floor) {
      const floors = query.floor.split(',')
        .map(floor => _.toNumber(floor))
        .filter(floor => !_.isNaN(floor));
      if (floors && floors.length > 1) {
        searchValues.floor = floors;
      } else {
        const floor = _.toNumber(query.floor);
        if (!_.isNaN(floor)) {
          searchValues.floor = floor;
        }
      }
    }

    if (query.location) {
      const locations = query.location.split(',');
      if (locations.length > 1) {
        searchValues.location = locations;
      } else {
        searchValues.location = query.location;
      }
    }

    if (query.number) {
      const number = _.toNumber(query.number);
      if (!_.isNaN(number)) {
        searchValues.number = number;
      }
    }

    return { ...searchValues, ..._.pick(query, 'type', 'name') };
  }
  return {};
};

const mongoQueryBuilder = (searchValues) => {
  const $and = [];
  const mongoQuery = {};

  if (searchValues.name) {
    mongoQuery.name = {
      $regex: new RegExp(searchValues.name, 'i'),
    };
  }

  if (searchValues.floor || _.isNumber(searchValues.floor)) {
    if (searchValues.floor.length > 1) {
      $and.push({
        $or: searchValues.floor.map(floor => ({ floor })),
      });
    } else {
      mongoQuery.floor = searchValues.floor;
    }
  }

  if (searchValues.location) {
    if (_.isArray(searchValues.location)) {
      $and.push({
        $or: searchValues.location.map(location => ({ location })),
      });
    } else {
      mongoQuery.location = searchValues.location;
    }
  }

  if (searchValues.type) {
    mongoQuery.type = {
      $regex: new RegExp(searchValues.type, 'i'),
    };
  }

  if (searchValues.number) {
    mongoQuery.number = searchValues.number;
  }

  if ($and.length > 0) {
    mongoQuery.$and = $and;
  }

  // if (searchValues.class) {
  //   mongoQuery[`bookings.${searchValues.week}.bookings`] = {
  //     $elemMatch: {
  //       class: {
  //         $regex: new RegExp(searchValues.class, 'i'),
  //       },
  //     },
  //   };
  // }

  // if (searchValues.subject) {
  //   mongoQuery[`bookings.${searchValues.week}.bookings`] = {
  //     $elemMatch: {
  //       subjectCode: {
  //         $regex: new RegExp(searchValues.subject, 'i'),
  //       },
  //     },
  //   };
  // }

  // if (searchValues.tutor) {
  //   mongoQuery[`bookings.${searchValues.week}.bookings`] = {
  //     $elemMatch: {
  //       tutor: {
  //         $regex: new RegExp(searchValues.tutor, 'i'),
  //       },
  //     },
  //   };
  // }

  // if (searchValues.time) {
  //   mongoQuery[`bookings.${searchValues.week}.bookings`] = {
  //     $elemMatch: {
  //       start: { $lte: searchValues.time },
  //       end: { $gte: searchValues.time },
  //     },
  //   };
  // }

  // if (searchValues.sTime) {
  //   mongoQuery[`bookings.${searchValues.week}.bookings`] = {
  //     $elemMatch: {
  //       start: { $gte: searchValues.sTime },
  //       end: { $lte: searchValues.eTime ? searchValues.eTime : moment(searchValues.sTime).endOf('day') },
  //     },
  //   };
  // }

  // if (searchValues.eTime) {
  //   mongoQuery[`bookings.${searchValues.week}.bookings`] = {
  //     $elemMatch: {
  //       start: { $gte: searchValues.sTime ? searchValues.sTime : moment(searchValues.eTime).startOf('day') },
  //       end: { $lte: searchValues.eTime },
  //     },
  //   };
  // }

  return mongoQuery;
};

const mongoBookingsQueryBuilder = (query) => {
  const match = {
    $and: [],
  };

  if (!query.time) {
    const startDate = { 'bookings.start': { $gte: moment().week(query.week).startOf('week').toDate() } };
    const endDate = { 'bookings.end': { $lte: moment().week(query.week).endOf('week').toDate() } };
    match.$and = [...match.$and, startDate, endDate];
  }

  return match;
};

const mongoProjectionBuilder = (query) => {
  const projections = {};

  if (query.time) {
    query.week = moment.unix(query.time).week();
  }

  if (!query.week) {
    if (query.week) {
      query.week = _.toNumber(query.week);
    } else {
      query.week = moment().week();
    }
  }

  if (query.time || query.sTime || query.eTime || query.class || query.tutor || query.subject) {
    projections['bookings.$'] = 1;
    projections[''] = 1;
    return projections;
  }

  if (query.onlyNames !== undefined) {
    projections.name = 1;
    return projections;
  }

  if (query.withBookings === undefined) {
    projections.bookings = 0;
  } else {
    // projections.bookings = 1;
    // projections[''] = 1;
  }

  return projections;
};

module.exports = {
  Room,
  getSearchValues,
  mongoQueryBuilder,
  mongoProjectionBuilder,
  mongoBookingsQueryBuilder,
};
