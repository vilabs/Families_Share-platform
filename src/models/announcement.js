const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
  announcement_id: {
    type: String,
    unique: true,
    required: true
  },
  group_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  body: String
}, { timestamps: true, toJSON: { virtuals: true } })

announcementSchema.index({ group_id: 1, createdAt: -1 })

announcementSchema.virtual('images', {
  ref: 'Image',
  localField: 'announcement_id',
  foreignField: 'owner_id',
  justOne: false
})

mongoose.pluralize(null)
const model = mongoose.model('Announcement', announcementSchema)

module.exports = model
