const mongoose = require('mongoose');


const parentSchema = new mongoose.Schema({
    parent_id: String,
    child_id: String,
},{timestamps: true});

mongoose.pluralize(null);
const model = mongoose.model('Parent',parentSchema);

module.exports = model ;