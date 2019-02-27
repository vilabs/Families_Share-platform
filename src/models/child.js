const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    child_id: {
        type: String,
        unique: true,
    },
    given_name: String,
    family_name: String,
    gender: String,
    birthdate: Date,
    image_id: String,
    background: String,
    allergies: String,
    special_needs: String,
    other_info: String,
},{timestamps: true, toJSON: { virtuals: true }});

childSchema.virtual('image', {
    ref: 'Image',
    localField: 'image_id',
    foreignField: 'image_id',
    justOne: true,
});

mongoose.pluralize(null);
const model = mongoose.model('Child',childSchema);

module.exports = model ;