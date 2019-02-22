const mongoose = require('mongoose');

const imageSchema =  new mongoose.Schema({
    image_id: {
        type: String,
        unique: true,
    },
    path: String,
    thumbnail_path: String,
    owner_type: String,
    owner_id: String,
},{timestamps: true})

mongoose.pluralize(null);
const model = mongoose.model('Image',imageSchema);

module.exports = model ;