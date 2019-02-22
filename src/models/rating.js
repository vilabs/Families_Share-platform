const mongoose = require('mongoose');


const ratingSchema = new mongoose.Schema({
    user_id: String,
    rating: Number,
},{timestamps: true});

mongoose.pluralize(null);
const model = mongoose.model('Rating',ratingSchema);

module.exports = model ;