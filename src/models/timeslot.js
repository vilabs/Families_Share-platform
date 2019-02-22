const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
	timeslot_id: {
		type: String,
		unique: true
	},
	activity_id: String,
},{timestamps: true})

mongoose.pluralize(null);
const model = mongoose.model('Timeslot',timeslotSchema);


module.exports = model