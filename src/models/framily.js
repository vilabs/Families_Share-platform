const mongoose = require('mongoose')

const framilySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  framily_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

framilySchema.index({ user_id: 1 })
framilySchema.index({ user_id: 1, framily_id: 1 }, { unique: true })

mongoose.pluralize(null)
const model = mongoose.model('Framily', framilySchema)

module.exports = model
