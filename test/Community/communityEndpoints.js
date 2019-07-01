const common = require('../common')
const server = common.server
const chai = common.chai

const User = require('../../src/models/user')
const Community = require('../../src/models/community')

describe('/Get/api/community', () => {
  it('it should fetch the analytics of the community when user is authenticated and community manager', async () => {
    try {
      await User.updateOne({ email: 'test@email.com' }, { role: 'manager' })
      const user = await User.findOne({ email: 'test@email.com' })
      const res = await chai
        .request(server)
        .get(`/api/community`)
        .set('Authorization', user.token)
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('analytics')
      res.body.should.have.property('configurations')
    } catch (err) {
      throw err
    }
  })
})

describe('/Get/api/community', () => {
  it('it should not fetch the analytics of the commuity when user isnt community manager', async () => {
    try {
      await User.updateOne({ email: 'test2@email.com' }, { role: 'parent' })
      const user = await User.findOne({ email: 'test3@email.com' })
      const res = await chai
        .request(server)
        .get(`/api/community`)
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})

describe('/Get/api/community', () => {
  it('it should not fetch the analytics of the community when user isnt authenticated', (done) => {
    chai
      .request(server)
      .get(`/api/community`)
      .set('Authorization', 'invalidtoken')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})

describe('/Patch/api/community', () => {
  it('it should update the configurations of the community when user is authenticated and community manager', async () => {
    try {
      const user = await User.findOne({ email: 'test@email.com' })
      const res = await chai
        .request(server)
        .get(`/api/community`)
        .set('Authorization', user.token)
        .send({ auto_admin: true })
      const community = await Community.findOne({}).lean()
      res.should.have.status(200)
      community.analytics.should.have.property('auto_admin').to.equal(true)
    } catch (err) {
      throw err
    }
  })
})

describe('/Get/api/community', () => {
  it('it should not update the configurations of the commuity when user isnt community manager', async () => {
    try {
      await User.updateOne({ email: 'test2@email.com' }, { role: 'parent' })
      const user = await User.findOne({ email: 'test3@email.com' })
      const res = await chai
        .request(server)
        .get(`/api/community`)
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})

describe('/Get/api/community', () => {
  it('it should not update the configurations of the community when user isnt authenticated', (done) => {
    chai
      .request(server)
      .get(`/api/community`)
      .set('Authorization', 'invalidtoken')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})
