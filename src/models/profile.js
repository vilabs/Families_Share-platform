const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_id: {
        type: String,
        unique: true,
    },
    address_id: String,
    email: String,
    phone: String,
    phone_type: String,
    image_id: String,
    given_name: String,
    family_name: String,
    visible: Boolean,
}, {timestamps: true, toJSON: { virtuals: true }});


profileSchema.virtual('image', {
    ref: 'Image',
    localField: 'image_id',
    foreignField: 'image_id',
    justOne: true,
});
profileSchema.virtual('address', {
    ref: 'Address',
    localField: 'address_id',
    foreignField: 'address_id',
    justOne: true,
});


mongoose.pluralize(null);
const model = mongoose.model('Profile', profileSchema);

module.exports = model ;