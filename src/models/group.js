const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    group_id: {
        type: String,
        unique: true,
    },
    name: { 
        type: String,
        unique: true
    },
    description: String,
		location: String,
		calendar_id: String,
    settings_id: String,
    image_id: String,
    background: String,
    owner_id: String,
    
},{timestamps: true, toJSON: { virtuals: true } });

groupSchema.index({ name: 1}); 

groupSchema.virtual('image', {
    ref: 'Image',
    localField: 'image_id',
    foreignField: 'image_id',
    justOne: true,
});

mongoose.pluralize(null);
const model = mongoose.model('Group', groupSchema);

module.exports = model ;