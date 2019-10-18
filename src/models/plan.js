const mongoose = require('mongoose')

const availabilitySchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true
  },
  meridiem: {
    type: String,
    required: true
  }
})

const needSchema = new mongoose.Schema({
  children: [String],
  day: {
    type: Date,
    required: true
  }
})

const participantSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  availabilities: [availabilitySchema],
  needs: [needSchema]
})

const planSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true
  },
  plan_id: {
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
  description: String,
  location: String,
  creator_id: String,
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  ratio: {
    type: Number,
    required: true
  },
  min_volunteers: {
    type: Number,
    required: true
  },
  category: {
    type: String
  },
  participants: [participantSchema]
}, { timestamps: true, toJSON: { virtuals: true } })

planSchema.index({ group_id: 1, createdAt: -1 })

mongoose.pluralize(null)
const model = mongoose.model('Plan', planSchema)

module.exports = model
