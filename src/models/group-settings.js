const mongoose = require('mongoose');
const objectid = require('objectid');

const groupSettingsSchema = new mongoose.Schema({
    settings_id: {
        type: String,
        unique: true,
        default: objectid,
    },
    group_id: String,
    open: Boolean,
    visible: Boolean,
},{timestamps: true});

groupSettingsSchema.index({ group_id: 1 }); 

mongoose.pluralize(null);
const model = mongoose.model('Group_Settings', groupSettingsSchema);

module.exports = model ;