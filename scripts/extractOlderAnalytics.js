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

const fillInMissing = (values) => {
  const startDate = moment(values[0]._id)
  const endDate = moment(values[values.length - 1]._id)
  const dates = enumerateDaysBetweenDates(startDate, endDate)
  const withMissingValues = []
  dates.forEach((date, index) => {
    const i = values.map(value => value._id).indexOf(date)
    const total = i >= 0 ? values[i].total : withMissingValues[index - 1].total
    withMissingValues.push({
      _id: date,
      total
    })
  })
  return withMissingValues
}

const enumerateDaysBetweenDates = (startDate, endDate) => {
  const now = startDate.clone(); const dates = []
  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('YYYY-MM-DD'))
    now.add(1, 'days')
  }
  return dates
}

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

const aggregate = (model) => (
  model.aggregate([
    {
      '$project': {
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

const getAnalytics = async (model) => {
  const data = await aggregate(model)
  return fillInMissing(accumulate(dateSort(data)))
}

const extract = async () => {
  try {
    const newUsersAnalytics = await getAnalytics(User)
    const newChildrenAnalytics = await getAnalytics(Child)
    const newGroupsAnalytics = await getAnalytics(Group)
    console.log('Date,Total Users')
    newUsersAnalytics.forEach(item => console.log(`${item._id},${item.total}`))
    console.log('\n')
    console.log('Date,Total Children')
    newChildrenAnalytics.forEach(item => console.log(`${item._id},${item.total}`))
    console.log('\n')
    console.log('Date,Total Groups')
    newGroupsAnalytics.forEach(item => console.log(`${item._id},${item.total}`))
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

extract()
