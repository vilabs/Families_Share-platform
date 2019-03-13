const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  image_id: {
    type: String,
    unique: true,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  thumbnail_path: {
    type: String
  },
  owner_type: {
    type: String,
    required: true
  },
  owner_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

imageSchema.index({ owner_id: 1 })

mongoose.pluralize(null)
const model = mongoose.model('Image', imageSchema)

module.exports = model
