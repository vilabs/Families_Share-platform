const mongoose = require('mongoose')

const communitySchema = new mongoose.Schema({
  auto_admin: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true })

communitySchema.index({ user_id: 1 })

mongoose.pluralize(null)
const model = mongoose.model('Community', communitySchema)

module.exports = model
