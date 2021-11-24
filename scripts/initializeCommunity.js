const mongoose = require('mongoose')
const Community = require('../src/models/community')

mongoose.connect(process.env['DB_CONNECTION_STRING']) // { autoIndex: false } set this to false in production to disable auto creating indexes
mongoose.Promise = global.Promise

const initialize = async () => {
  const community = await Community.findOne({})
  if (community === null) {
    await Community.create({})
  }
}

initialize()
