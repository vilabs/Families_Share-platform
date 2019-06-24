const common = require('../common')
const server = common.server
const chai = common.chai

const User = require('../../src/models/user')

describe('/Get/api/community/analytics', () => {
  it('it should fetch the analytics of the community when user is authenticated and community manager', async () => {
    try {
      await User.updateOne({ email: 'test@email.com' }, { role: 'manager' })
      const user = await User.findOne({ email: 'test@email.com' })
      const res = await chai
        .request(server)
        .get(`/api/community/analytics`)
        .set('Authorization', user.token)
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('totalNumberOfUsers')
      res.body.should.have.property('totalNumberOfGroups')
      res.body.should.have.property('totalNumberOfChildren')
      res.body.should.have.property('communityGrowth')
      res.body.should.have.property('averageNumberOfMembersPerGroup')
      res.body.should.have.property('averageNumberOfActivitiesPerGroup')
      res.body.should.have.property('averageAppRating')
      res.body.should.have.property('totalNumberOfPlatformSignups')
      res.body.should.have.property('totalNumberOfGoogleSignups')
    } catch (err) {
      throw err
    }
  })
})

describe('/Get/api/community/analytics', () => {
  it('it should not fetch the analytics of the commuity when user isnt community manager', async () => {
    try {
      await User.updateOne({ email: 'test2@email.com' }, { role: 'parent' })
      const user = await User.findOne({ email: 'test3@email.com' })
      const res = await chai
        .request(server)
        .get(`/api/community/analytics`)
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})

describe('/Get/api/community/analytics', () => {
  it('it should not fetch the analytics of the community when user isnt authenticated', (done) => {
    chai
      .request(server)
      .get(`/api/community/analytics`)
      .set('Authorization', 'invalidtoken')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})
