const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_id: {
        type: String,
				unique: true,
				required: true,
    },
    address_id: {
			type: String,
			required: true
		},
    email:  {
			type: String,
			required: true,
			match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		},
    phone: String,
    phone_type: String,
    image_id:  {
			type: String,
			required: true
		},
    given_name:  {
			type: String,
			required: true
		},
    family_name:  {
			type: String,
			required: true
		},
    visible:  {
			type: Boolean,
			required: true
		},
}, {timestamps: true, toJSON: { virtuals: true }});

profileSchema.index({ given_name: 1, family_name: 1}); 

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