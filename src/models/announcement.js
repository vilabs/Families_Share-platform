const mongoose = require('mongoose');
const objectid = require('objectid');

const announcementSchema =  new mongoose.Schema({
    announcement_id: {
        type: String,
        unique: true,
    },
    group_id: String,
    user_id: String,
    body: String,
},{timestamps: true, toJSON: { virtuals: true }})

announcementSchema.virtual('images', {
    ref: 'Image',
    localField: 'announcement_id',
    foreignField: 'owner_id',
    justOne: false,
});
//announcementSchema.index({"createdAt": -1});

mongoose.pluralize(null);
const model = mongoose.model('Announcement', announcementSchema);

module.exports = model ;