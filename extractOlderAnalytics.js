const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(process.env.DB_DEV_HOST) // { autoIndex: false } set this to false in production to disable auto creating indexes
mongoose.Promise = global.Promise
const moment = require('moment')

const User = require('./src/models/user')
const Group = require('./src/models/group')
const Child = require('./src/models/child')
const Member = require('./src/models/member')

const accumulate = (array) => (
  array.map((date, index) => ({
    ...date,
    total: array.slice(0, index).map(d => d.new).reduce((a, b) => a + b, 0)
  }))
)

const dateSort = (array) => (
  array.sort((a, b) => {
    return moment(a._id).diff(moment(b._id))
  })
)

const aggregate = (model, projectionFields) => (
  model.aggregate([
    {
      '$project': {
        ...projectionFields,
        'date': { '$dateToString': { format: '%Y-%m-%d', date: '$createdAt' } }

      }
    },
    {
      '$group': {
        _id: '$date',
        new: {
          $sum: 1
        }
      }
    }
  ])
)

async function extract () {
  const newUsers = await aggregate(User)
  const newChildren = await aggregate(Child)
  const newGroups = await aggregate(Group)
  const newMembers = await aggregate(Member, { 'group_id': 1 })
  const newUsersAnalytics = accumulate(dateSort(newUsers))
  const newChildrenAnalytics = accumulate(dateSort(newChildren))
  const newGroupsAnalytics = accumulate(dateSort(newGroups))
  process.exit()
}

extract()
