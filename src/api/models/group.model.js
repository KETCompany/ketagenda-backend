const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  createdBy: String,
  updated: Array,
  createdAt: Date,
  updatedAt: Date,
}, {
  strict: 'throw',
  timestamps: true,
  useNestedStrict: true,
});

let Group;
try {
  Group = mongoose.model('groups');
} catch (e) {
  Group = mongoose.model('groups', groupSchema);
}

module.exports = {
  Group,
};
