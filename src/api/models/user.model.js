const mongoose = require('mongoose');

const { Group } = require('./group.model');

const { Schema } = mongoose;

const userModel = new Schema({
  name: String,
  email: { type: String, unique: true },
  role: {
    type: String, enum: ['Admin', 'Student', 'Teacher'],
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'groups',
    validate: {
      validator: v =>
        Group.find({ _id: v })
          .then(docs => docs.length !== 0),
      message: 'Group does not exist!',
    },
  }],
  events: [{ type: Schema.Types.ObjectId, ref: 'events' }],

  updated: Array,
  createdAt: Date,
  updatedAt: Date,
}, {
  strict: 'throw',
  useNestedStrict: true,
});

const User = mongoose.model('users', userModel);

module.exports = {
  User,
};
