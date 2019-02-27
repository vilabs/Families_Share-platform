const mongoose = require('mongoose');
const objectid = require('objectid');

const addressSchema = new mongoose.Schema({
    address_id: {
        type: String,
        unique: true,
        default: objectid,
    },
    street: String,
    number: String,
    city: String,
},{timestamps: true, toJSON: { virtuals: true }});

mongoose.pluralize(null);
const model = mongoose.model('Address',addressSchema);

module.exports = model ;