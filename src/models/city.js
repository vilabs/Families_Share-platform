const mongoose = require('mongoose');
const objectid = require('objectid');

const citySchema = new mongoose.Schema({
    city_id : {
        type: String,
        unique: true,
        default: objectid,
    },
    name: {
        type: String,
        unique: true
    },
    zipcode: String,
}, { timestamps: true });



mongoose.pluralize(null);
const model = mongoose.model('City',citySchema);

module.exports = model ;