const mongoose = require('mongoose');
const objectid = require('objectid');

const notificationSchema = new mongoose.Schema({
    notification_id: {
        type: String,
        unique: true,
        default: objectid,
    },
    owner_id: String,
    owner_type: String,
		type: String,
		code: Number,
		subject: String,
		object: String,
		read: Boolean,
},{timestamps: true});

mongoose.pluralize(null);
const model = mongoose.model('Notification', notificationSchema);

module.exports = model ;