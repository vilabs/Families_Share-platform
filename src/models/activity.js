const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  activity_id: {
    type: String,
    unique: true,
    required: true
  },
  group_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  group_name: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  color: {
    type: String,
    required: true
  },
  creator_id: String,
  repetition: {
    type: Boolean,
    required: true
  },
  repetition_type: {
    type: String
  },
  different_timeslots: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } })

activitySchema.index({ group_id: 1, createdAt: -1 })

mongoose.pluralize(null)
const model = mongoose.model('Activity', activitySchema)

module.exports = model
