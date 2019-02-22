const mongoose = require('mongoose');
const objectid = require('objectid');

const replySchema =  new mongoose.Schema({
    reply_id: {
        type: String,
        unique: true,
        default: objectid
    },
    announcement_id: String,
    user_id: String,
    body: String,
},{timestamps: true})

mongoose.pluralize(null);
const model = mongoose.model('Reply',replySchema);

module.exports = model ;