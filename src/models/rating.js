const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user_id: {
			type: String,
			required: true,
			unique: true,
		},
    rating: {
			type: Number,
			required: true
		},
},{timestamps: true});

mongoose.pluralize(null);
const model = mongoose.model('Rating',ratingSchema);

module.exports = model ;