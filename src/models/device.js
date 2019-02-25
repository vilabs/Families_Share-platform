const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
	device_id: {
		type: String,
		unique: true,
	},
	user_id: String,
},{timestamps: true})

deviceSchema.index({ user_id: 1}); 

mongoose.pluralize(null);
const model = mongoose.model('Device',deviceSchema);


module.exports = model