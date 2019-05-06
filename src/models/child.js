const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({
  child_id: {
    type: String,
    unique: true,
    required: true
  },
  given_name: {
    type: String,
    required: true
  },
  family_name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  image_id: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  allergies: String,
  special_needs: String,
	other_info: String,
	suspended: {
		type: Boolean,
		required: true,
	}
}, { timestamps: true, toJSON: { virtuals: true } })

childSchema.virtual('image', {
  ref: 'Image',
  localField: 'image_id',
  foreignField: 'image_id',
  justOne: true
})

mongoose.pluralize(null)
const model = mongoose.model('Child', childSchema)

module.exports = model
