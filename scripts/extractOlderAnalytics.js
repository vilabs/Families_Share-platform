const mongoose = require('mongoose')
const moment = require('moment')
const args = process.argv.slice(2)
const mongoUri = args[0]
const date = args[1]
const month = args[2]
const year = args[3]
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.Promise = global.Promise
mongoose.connect(mongoUri)

const User = require('../src/models/user')
const Group = require('../src/models/group')
const Child = require('../src/models/child')

const fillInMissing = (values) => {
  const startDate = moment().set({
    date,
    month,
    year
  })
  const endDate = moment()
  const dates = enumerateDaysBetweenDates(startDate, endDate)
  const withMissingValues = []
  dates.forEach((date, index) => {
    const i = values.map(value => value._id).indexOf(date)
    let total
    if (i >= 0) {
      total = values[i].total
    } else {
      if (withMissingValues[index - 1] !== undefined) {
        total = withMissingValues[index - 1].total
      } else {
        total = 0
      }
    }
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
    total: array.slice(0, index + 1).map(d => d.total).reduce((a, b) => a + b, 0)
  }))
)

const dateSort = (array) => (
  array.sort((a, b) => {
    return moment(a._id).diff(moment(b._id))
  })
)

const aggregate = (model, match) => (
  model.aggregate([
    {
      '$match': {
        ...match
      }
    },
    {
      '$project': {
        '_id': false,
        'date': { '$dateToString': { format: '%Y-%m-%d', date: '$createdAt' } }
      }
    },
    {
      '$group': {
        _id: '$date',
        total: {
          $sum: 1
        }
      }
    }

  ])
)

const getAnalytics = async (model, match) => {
  const data = await aggregate(model, match)
  return fillInMissing(accumulate(dateSort(data)))
}

const extract = async () => {
  try {
    const GUA = await getAnalytics(User, { provider: 'google', email: { $ne: 'fonikhmyga@gmail.com' } })
    const PUA = await getAnalytics(User, { provider: 'families_share' })
    const TUA = GUA.map((x, idx) => ({ _id: x._id, total: GUA[idx].total + PUA[idx].total }))
    const TCA = await getAnalytics(Child, { given_name: { $ne: 'Test ' } })
    const TGA = await getAnalytics(Group, { name: { $ne: 'Test ' } })
    console.log('Date,Total number of users,Users registered with platform,Users registered with google,Total number of children,Total number of groups,Average Number of members per group,Average number of activities per group')
    for (let i = 0; i < GUA.length; i++) {
      console.log(TUA[i]._id, TUA[i].total, PUA[i].total, GUA[i].total, TCA[i].total, TGA[i].total, 0, 0)
    }
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

extract()
