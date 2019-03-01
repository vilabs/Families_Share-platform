const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
	timeslot_id: {
		type: String,
		unique: true,
		required: true
	},
	activity_id: {
		type: String,
		required: true,
	}
},{timestamps: true})

mongoose.pluralize(null);
const model = mongoose.model('Timeslot',timeslotSchema);

timeslotSchema.index({ activity_id: 1}); 

module.exports = model