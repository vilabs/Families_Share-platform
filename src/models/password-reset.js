const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  }
}, { timestamps: true })

passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

mongoose.pluralize(null)
const model = mongoose.model('Password_Reset', passwordResetSchema)

module.exports = model
