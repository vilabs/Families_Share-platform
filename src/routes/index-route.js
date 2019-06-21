const express = require('express')
const router = new express.Router()

// const Profile = require('../models/profile')
const Group = require('../models/group')
const Member = require('../models/member')
const User = require('../models/user')
// const Parent = require('../models/parent')
const Child = require('../models/child')
// const Announcement = require('../models/announcement')
const Activity = require('../models/activity')
const Rating = require('../models/rating')

router.get('/analytics', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  try {
    const totalNumberOfUsers = await User.estimatedDocumentCount({})
    const totalNumberOfChildren = await Child.estimatedDocumentCount({})
    const totalNumberOfGroups = await Group.estimatedDocumentCount({})
    const totalNumberOfGroupMembers = await Member.estimatedDocumentCount({ group_accepted: true, user_accepted: true })
    const averageNumberOfMembersPerGroup = Math.floor(totalNumberOfGroupMembers / totalNumberOfGroups)
    const totalNumberOfActivities = await Activity.estimatedDocumentCount({})
    const averageNumberOfActivitiesPerGroup = Math.floor(totalNumberOfActivities / totalNumberOfGroups)
    const averageAppRating = await Rating.aggregate([
      { '$group':
          {
            '_id': null,
            'avg': {
              '$avg': '$rating'
            }
          }
      }
    ])
    const response = {
      totalNumberOfUsers,
      totalNumberOfGroups,
      averageNumberOfMembersPerGroup,
      averageNumberOfActivitiesPerGroup,
      totalNumberOfChildren,
      averageAppRating
    }
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
})

module.exports = router
