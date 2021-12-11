const mongoose = require('mongoose')

const activityRequestSchema = new mongoose.Schema({
  group_id: {
    type: String,
    required: true
  },
  creator_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  color: {
    type: String,
    required: true
  },
  children: {
    type: Array,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } })

activityRequestSchema.index({ group_id: 1, createdAt: -1 })

mongoose.pluralize(null)
const model = mongoose.model('ActivityRequest', activityRequestSchema)

module.exports = model
