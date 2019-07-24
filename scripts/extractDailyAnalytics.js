require('dotenv').config()
const mongoose = require('mongoose')
const moment = require('moment')
const args = process.argv.slice(2)
const mongoUri = args[0]
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.Promise = global.Promise
mongoose.connect(mongoUri)

const User = require('../src/models/user')
const Group = require('../src/models/group')
const Child = require('../src/models/child')
const Activity = require('../src/models/activity')
const Member = require('../src/models/member')

const getDailyAnalytics = async () => {
  try {
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
    console.log(
      moment().format('YYYY-MM-DD'), totalNumberOfUsers, totalNumberOfGoogleSignups,
      totalNumberOfPlatformSignups, totalNumberOfChildren, averageNumberOfMembersPerGroup,
      averageNumberOfActivitiesPerGroup
    )
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

getDailyAnalytics()
