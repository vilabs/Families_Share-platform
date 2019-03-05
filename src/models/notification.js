const mongoose = require('mongoose');
const objectid = require('objectid');

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    unique: true,
    default: objectid,
  },
  owner_id: {
    type: String,
    required: true,
  },
  owner_type: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  subject: String,
  object: String,
  read: Boolean,
}, { timestamps: true });

notificationSchema.index({ owner_type: 1, owner_id: 1, createdAt: -1 });

mongoose.pluralize(null);
const model = mongoose.model('Notification', notificationSchema);

module.exports = model;
