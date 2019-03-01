const mongoose = require('mongoose');
const objectid = require('objectid');

const groupSettingsSchema = new mongoose.Schema({
	settings_id: {
		type: String,
		unique: true,
		default: objectid,
	},
	group_id: {
		type: String,
		unique: true,
		required: true,
	},
	open: {
		type: Boolean,
		required: true,
	},
	visible: {
		type: Boolean,
		required: true,
	},
}, { timestamps: true });

groupSettingsSchema.index({ group_id: 1 }); 

mongoose.pluralize(null);
const model = mongoose.model('Group_Settings', groupSettingsSchema);

module.exports = model ;