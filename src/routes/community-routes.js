const express = require('express')
const router = new express.Router()
const path = require('path')
// const Profile = require('../models/profile')
const Group = require('../models/group')
const Member = require('../models/member')
const User = require('../models/user')
// const Parent = require('../models/parent')
const Child = require('../models/child')
// const Announcement = require('../models/announcement')
const Activity = require('../models/activity')
const Rating = require('../models/rating')
const Community = require('../models/community')

router.get('/', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  try {
    const user = await User.findOne({ user_id: req.user_id })
    if (user.role !== 'manager') {
      return res.status(401).send('Unauthorized')
    }
    const community = await Community.findOne({}).lean()
    const users = await User.find({ email: { $ne: 'fonikhmyga@gmail.com' } }).lean()
    const totalNumberOfUsers = users.length
    const totalNumberOfGoogleSignups = users.filter(user => user.provider === 'google').length
    const totalNumberOfPlatformSignups = totalNumberOfUsers - totalNumberOfGoogleSignups
    const totalNumberOfChildren = await Child.estimatedDocumentCount({ given_name: { $ne: 'Test' } })
    const totalNumberOfGroups = await Group.estimatedDocumentCount({ name: { $ne: 'Test' } })
    const totalNumberOfGroupMembers = await Member.estimatedDocumentCount({ group_accepted: true, user_accepted: true })
    const totalNumberOfActivities = await Activity.estimatedDocumentCount({ name: { $ne: 'Test' } })
    let averageNumberOfMembersPerGroup = 0
    let averageNumberOfActivitiesPerGroup = 0
    if (totalNumberOfGroups !== 0) {
      averageNumberOfMembersPerGroup = Math.floor(totalNumberOfGroupMembers / totalNumberOfGroups)
      averageNumberOfActivitiesPerGroup = Math.floor(totalNumberOfActivities / totalNumberOfGroups)
    }
    let averageAppRating = await Rating.aggregate([
      { '$group':
          {
            '_id': null,
            'avg': {
              '$avg': '$rating'
            }
          }
      }
    ])
    const { auto_admin } = community
    const response = {
      configurations: { auto_admin },
      analytics: {
        totalNumberOfUsers,
        totalNumberOfGroups,
        averageNumberOfMembersPerGroup,
        averageNumberOfActivitiesPerGroup,
        totalNumberOfChildren,
        totalNumberOfGoogleSignups,
        totalNumberOfPlatformSignups,
        averageAppRating: Number.parseFloat(averageAppRating[0].avg).toFixed(1)
      }
    }
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
})

router.get('/data', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  try {
    const user = await User.findOne({ user_id: req.user_id })
    if (user.role !== 'manager') {
      return res.status(401).send('Unauthorized')
    }
    const file = path.join(__dirname, '../../analytics', `${process.env.CITYLAB.toLowerCase()}.csv`)
    res.sendFile(file)
  } catch (err) {
    next(err)
  }
})

router.patch('/', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  try {
    const user = await User.findOne({ user_id: req.user_id })
    if (user.role !== 'manager') {
      return res.status(401).send('Unauthorized')
    }
    const { auto_admin } = req.body
    if (auto_admin === undefined) {
      return res.status(400).send('Bad request')
    }
    await Community.updateOne({}, { ...req.body })
    res.status(200).send('Community configurations updated')
  } catch (err) {
    next(err)
  }
})

module.exports = router
