const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
	day_id: {
		unique: true,
		type: String,
	},
	date: Date,
	activity_id: String,
},{timestamps: true})

mongoose.pluralize(null);
const model = mongoose.model('Day',daySchema);


module.exports = model