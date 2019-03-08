const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  group_id: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  group_accepted: {
    type: Boolean,
    required: true,
  },
  user_accepted: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

memberSchema.index({ group_id: 1, user_id: 1 }, { unique: true });
memberSchema.index({ group_id: 1, user_accepted: 1 });
memberSchema.index({ user_id: 1, group_accepted: 1 });
memberSchema.index({ user_id: 1, group_accepted: 1, user_accepted: 1});
memberSchema.index({
  group_id: 1, user_id: 1, group_accepted: 1, user_accepted: true,
});

mongoose.pluralize(null);
const model = mongoose.model('Member', memberSchema);

module.exports = model;
