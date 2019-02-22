const mongoose = require('mongoose');


const framilySchema = new mongoose.Schema({
    user_id: String,
    framily_id: String,
}, {timestamps: true});

mongoose.pluralize(null);
const model = mongoose.model('Framily',framilySchema);

module.exports = model ;