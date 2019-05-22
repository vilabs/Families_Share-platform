const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  group_id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  calendar_id: {
    type: String,
    unique: true,
    required: true
  },
  settings_id: {
    type: String,
    unique: true,
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
  owner_id: {
    type: String,
    required: true
  }

}, { timestamps: true, toJSON: { virtuals: true } })

groupSchema.index({ name: 1 })

groupSchema.virtual('image', {
  ref: 'Image',
  localField: 'image_id',
  foreignField: 'image_id',
  justOne: true
})

mongoose.pluralize(null)
const model = mongoose.model('Group', groupSchema)

module.exports = model
