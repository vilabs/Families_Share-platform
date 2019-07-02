const common = require('../common')

const { server } = common
const { chai } = common

const User = require('../../src/models/user')
const Group = require('../../src/models/group')
const Activity = require('../../src/models/activity')
const Parent = require('../../src/models/parent')
const Child = require('../../src/models/child')

describe('/Post/api/groups/id/activities', () => {
  it('it should post a new activity when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const activity = {
          information: {
            name: 'Test Activity',
            color: '#00838F',
            description: 'test'
          },
          dates: {
            selectedDays: [
              '2019-03-06T22:00:00.000Z',
              '2019-03-13T22:00:00.000Z',
              '2019-03-20T22:00:00.000Z',
              '2019-03-27T22:00:00.000Z'
            ],
            repetition: true,
            repetitionType: 'weekly'
          },
          timeslots: {
            activityTimeslots: [
              [
                {
                  startTime: '20:00',
                  endTime: '22:00',
                  description: 'Test ',
                  name: 'Test Timeslot',
                  requiredParents: 4,
                  requiredChildren: 10,
                  cost: 10,
                  location: 'Kuala lumpur'
                }
              ],
              [
                {
                  startTime: '20:00',
                  endTime: '22:00',
                  description: 'Test ',
                  name: 'Test Timeslot',
                  requiredParents: 4,
                  requiredChildren: 10,
                  cost: 10,
                  location: 'Kuala lumpur'
                }
              ],
              [
                {
                  startTime: '20:00',
                  endTime: '22:00',
                  description: 'Test ',
                  name: 'Test Timeslot',
                  requiredParents: 4,
                  requiredChildren: 10,
                  cost: 10,
                  location: 'Kuala lumpur'
                }
              ],
              [
                {
                  startTime: '20:00',
                  endTime: '22:00',
                  description: 'Test ',
                  name: 'Test Timeslot',
                  requiredParents: 4,
                  requiredChildren: 10,
                  cost: 10,
                  location: 'Kuala lumpur'
                }
              ]
            ],
            differentTimeslots: false
          }
        }
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .send(activity)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})
describe('/Post/api/groups/id/activities', () => {
  it('it should not post a new activity with incorrect parameters', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const activity = {
          timeslots: {}
        }
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .send(activity)
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
    })
  })
})
describe('/Post/api/groups/id/activities', () => {
  it('it should not post a new activity when user isnt authenticated', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const activity = {}
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', 'invalidtoken')
          .send(activity)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})
describe('/Post/api/groups/id/activities', () => {
  it('it should not post a new activity when user isnt group member', done => {
    User.findOne({ email: 'test4@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        const activity = {}
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .send(activity)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/id/activities', () => {
  it('it should fetch a groups activities when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array').with.lengthOf(1)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/id/activities', () => {
  it('it should not fetch a groups activities when user isnt authenticated', done => {
    User.findOne({ email: 'test@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', 'invalidtoken')
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/id/activities', () => {
  it('it should not fetch a groups activities when user isnt group member', done => {
    User.findOne({ email: 'test4@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/groupId/activities/activityId', () => {
  it('it should fetch a groups activity when user is authenticated and group member', async () => {
    try {
      const user = await User.findOne({ email: 'test@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity' })
      const res = await chai
        .request(server)
        .get(`/api/groups/${group.group_id}/activities/${activity.activity_id}`)
        .set('Authorization', user.token)
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('name')
      res.body.should.have.property('description')
      res.body.should.have.property('color')
      res.body.should.have.property('activity_id')
      res.body.should.have.property('group_name')
      res.body.activity_id.should.be.eql(activity.activity_id)
    } catch (err) {
      throw err
    }
  })
})
describe('/Get/api/groups/groupId/activities/activityId', () => {
  it('it should not fetch a groups activity when user isnt authenticated ', async () => {
    try {
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity' })
      const res = await chai
        .request(server)
        .get(`/api/groups/${group.group_id}/activities/${activity.activity_id}`)
        .set('Authorization', 'invalidtoken')
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Get/api/groups/groupId/activities/activityId', () => {
  it('it should not fetch a groups activity when user isnt group member', async () => {
    try {
      const user = await User.findOne({ email: 'test4@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity' })
      const res = await chai
        .request(server)
        .get(`/api/groups/${group.group_id}/activities/${activity.activity_id}`)
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Get/api/groups/groupId/activities/activityId', () => {
  it('it should not fetch a groups activity when activity doesnt exist', async () => {
    try {
      const user = await User.findOne({ email: 'test@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const res = await chai
        .request(server)
        .get(`/api/groups/${group.group_id}/activities/invalidid`)
        .set('Authorization', user.token)
      res.should.have.status(404)
    } catch (err) {
      throw err
    }
  })
})
describe('/Patch/api/groups/groupId/activities/activityId', () => {
  it('it should patch a groups activity when user is authenticated and group admin', async () => {
    try {
      const user = await User.findOne({ email: 'test@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity' })
      const patch = { name: 'Test Activity Edit' }
      const res = await chai
        .request(server)
        .patch(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
        .send(patch)
      res.should.have.status(200)
    } catch (err) {
      throw err
    }
  })
})
describe('/Patch/api/groups/groupId/activities/activityId', () => {
  it('it should not patch a groups activity when user isnt authenticated', async () => {
    try {
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const patch = { name: 'Test Activity Edit' }
      const res = await chai
        .request(server)
        .patch(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', 'invalidtoken')
        .send(patch)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Patch/api/groups/groupId/activities/activityId', () => {
  it('it should not patch a groups activity when user isnt group member', async () => {
    try {
      const user = await User.findOne({ email: 'test4@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const patch = { name: 'Test Activity Edit' }
      const res = await chai
        .request(server)
        .patch(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
        .send(patch)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Patch/api/groups/groupId/activities/activityId', () => {
  it('it should not patch a groups activity when user isnt group admin or activity creator', async () => {
    try {
      const user = await User.findOne({ email: 'test3@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const patch = { name: 'Test Activity' }
      const res = await chai
        .request(server)
        .patch(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
        .send(patch)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Patch/api/groups/groupId/activities/activityId', () => {
  it('it should not patch a groups activity when parameters are incorrect', async () => {
    try {
      const user = await User.findOne({ email: 'test@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const patch = { foo: 'bar' }
      const res = await chai
        .request(server)
        .patch(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
        .send(patch)
      res.should.have.status(400)
    } catch (err) {
      throw err
    }
  })
})
describe('/Delete/api/groups/groupId/activities/activityId', () => {
  it('it should delete a groups activity when user is authenticated and group admin', async () => {
    try {
      const user = await User.findOne({ email: 'test3@email.com' })
      const group = await Group.findOne({ name: 'Test Group 2' })
      const activity = await Activity.findOne({ name: 'Test Activity 2' })
      const res = await chai
        .request(server)
        .delete(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
      res.should.have.status(200)
    } catch (err) {
      throw err
    }
  })
})
describe('/Get/api/groups/id/activities', () => {
  it('it should not fetch a groups activities when it has none', done => {
    User.findOne({ email: 'test3@email.com' }, (error, user) => {
      Group.findOne({ name: 'Test Group 2' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/activities`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})
describe('/Delete/api/groups/groupId/activities/activityId', () => {
  it('it should not delete a groups activity when user isnt authenticated', async () => {
    try {
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .delete(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', 'invalidtoken')
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Delete/api/groups/groupId/activities/activityId', () => {
  it('it should not delete a groups activity when user isnt group member', async () => {
    try {
      const user = await User.findOne({ email: 'test4@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .delete(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Delete/api/groups/groupId/activities/activityId', () => {
  it('it should not delete a groups activity when user isnt group admin', async () => {
    try {
      const user = await User.findOne({ email: 'test3@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .delete(
          `/api/groups/${group.group_id}/activities/${activity.activity_id}`
        )
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Post/api/groups/groupId/activities/activityId/export', () => {
  it('it should export a groups activity when user is authenticated and group admin', async () => {
    try {
      const user = await User.findOne({ email: 'test@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .post(
          `/api/groups/${group.group_id}/activities/${
            activity.activity_id
          }/export`
        )
        .set('Authorization', user.token)
      res.should.have.status(200)
    } catch (err) {
      throw err
    }
  })
})
describe('/Post/api/groups/groupId/activities/activityId/export', () => {
  it('it should not export a groups activity when user isnt authenticated', async () => {
    try {
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .post(
          `/api/groups/${group.group_id}/activities/${
            activity.activity_id
          }/export`
        )
        .set('Authorization', 'invalidtoken')
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Post/api/groups/groupId/activities/activityId/export', () => {
  it('it should not export a groups activity when user isnt group member', async () => {
    try {
      const user = await User.findOne({ email: 'test4@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .post(
          `/api/groups/${group.group_id}/activities/${
            activity.activity_id
          }/export`
        )
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Post/api/groups/groupId/activities/activityId/export', () => {
  it('it should not export a groups activity when user isnt group admin or activity creator', async () => {
    try {
      const user = await User.findOne({ email: 'test3@email.com' })
      const group = await Group.findOne({ name: 'Test Group Edit' })
      const activity = await Activity.findOne({ name: 'Test Activity Edit' })
      const res = await chai
        .request(server)
        .post(
          `/api/groups/${group.group_id}/activities/${
            activity.activity_id
          }/export`
        )
        .set('Authorization', user.token)
      res.should.have.status(401)
    } catch (err) {
      throw err
    }
  })
})
describe('/Get/api/groups/groupId/activities/activityId/timeslots', () => {
  it('it should fetch an activitys timeslots(events) when use is authenticated and group member', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const res = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    res.should.have.status(200)
    res.body.should.be.a('array').with.lengthOf(4)
  })
})

describe('/Get/api/groups/groupId/activities/activityId/timeslots', () => {
  it('it should not fetch an activitys timeslots(events) when use isnt authenticated', async () => {
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const res = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', 'invalidtoken')
    res.should.have.status(401)
  })
})
describe('/Get/api/groups/groupId/activities/activityId/timeslots', () => {
  it('it shouldnt fetch an activitys timeslots(events) when user isnt group member', async () => {
    const user = await User.findOne({ email: 'test4@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const res = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    res.should.have.status(401)
  })
})
describe('/Get/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should fetch an activitys timeslot when user is authenticated and group member', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const response = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const res = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${response.body[0].id}`
      )
      .set('Authorization', user.token)
    res.should.have.status(200)
    res.body.id.should.be.eql(response.body[0].id)
  })
})
describe('/Get/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not fetch an activity timeslots when user isnt authenticated', async () => {
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const res = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/timeslotId`
      )
      .set('Authorization', 'invalidtoken')
    res.should.have.status(401)
  })
})
describe('/Get/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it shouldnt fetch an activitys timeslot when user isnt group member', async () => {
    const user = await User.findOne({ email: 'test4@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const res = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/timeslotId`
      )
      .set('Authorization', user.token)
    res.should.have.status(401)
  })
})
describe('/Patch/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should edit a timeslot of an activity when user is authenticated and group member', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const parent = await Parent.findOne({ parent_id: user.user_id })
    const child = await Child.findOne({ child_id: parent.child_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    timeslots[0].extendedProperties.shared.status = 'confirmed'
    const parents = JSON.parse(timeslots[0].extendedProperties.shared.parents)
    const children = JSON.parse(
      timeslots[0].extendedProperties.shared.children
    )
    parents.push(user.user_id)
    children.push(child.child_id)
    timeslots[0].extendedProperties.shared.parents = JSON.stringify(parents)
    timeslots[0].extendedProperties.shared.children = JSON.stringify(children)
    const res = await chai
      .request(server)
      .patch(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', user.token)
      .send(timeslots[0])
    res.should.have.status(200)
  })
})
describe('/Patch/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not edit a timeslot of an activity when user isnt authenticated', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .patch(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', 'invalidtoken')
      .send(timeslots[0])
    res.should.have.status(401)
  })
})
describe('/Patch/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not edit a timeslot of an activity when user isnt group member', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const user2 = await User.findOne({ email: 'test4@email.com' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .patch(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', user2.token)
      .send(timeslots[0])
    res.should.have.status(401)
  })
})
describe('/Patch/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not edit a timeslot of an activity when parameters are incorrect', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .patch(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', user.token)
      .send({ foo: 'bar' })
    res.should.have.status(400)
  })
})
describe('/Delete/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should delete a timeslot of an activity when user is authenticated and group admin', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const parent = await Parent.findOne({ parent_id: user.user_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .query({ summary: timeslots[1].summary, parents: [] })
      .delete(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[1].id}`
      )
      .set('Authorization', user.token)
    res.should.have.status(200)
  })
})
describe('/Delete/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not delete a timeslot of an activity when user isnt group admin', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const user2 = await User.findOne({ email: 'test4@email.com' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .query({ summary: 'blah', parents: [] })
      .delete(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', user2.token)
    res.should.have.status(401)
  })
})
describe('/Delete/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not delete a timeslot of an activity when user isnt authenticated', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .query({ summary: 'blah', parents: [] })
      .delete(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', 'invalidtoken')
    res.should.have.status(401)
  })
})
describe('/Delete/api/groups/groupId/activities/activityId/timeslots/timeslotId', () => {
  it('it should not delete a timeslot of an activity when parameters are incorrect', async () => {
    const user = await User.findOne({ email: 'test@email.com' })
    const group = await Group.findOne({ name: 'Test Group Edit' })
    const activity = await Activity.findOne({ group_id: group.group_id })
    const timeslotResp = await chai
      .request(server)
      .get(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots`
      )
      .set('Authorization', user.token)
    const timeslots = timeslotResp.body
    const res = await chai
      .request(server)
      .query({ foo: 'bar' })
      .delete(
        `/api/groups/${group.group_id}/activities/${
          activity.activity_id
        }/timeslots/${timeslots[0].id}`
      )
      .set('Authorization', user.token)
    res.should.have.status(400)
  })
})
describe('/Get/api/groups/groupId/events', () => {
  it('it should fetch a groups events when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/events`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array').with.lengthOf(4)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/groupId/events', () => {
  it('it should not fetch a groups events when user isnt authenticated', done => {
    Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
      chai
        .request(server)
        .get(`/api/groups/${group.group_id}/events`)
        .set('Authorization', 'invalidtoken')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Get/api/groups/groupId/events', () => {
  it('it should not fetch a groups events when user isnt group member', done => {
    User.findOne({ email: 'test4@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/events`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/groupId/events', () => {
  it('it should not fetch a groups events for a non existing group', done => {
    User.findOne({ email: 'test@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/invalidId/events`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})
describe('/Get/api/groups/groupId/events', () => {
  it('it should not fetch a groups events when it has none', done => {
    User.findOne({ email: 'test3@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group 2' }, (err, group) => {
        chai
          .request(server)
          .get(`/api/groups/${group.group_id}/events`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})
describe('/Post/api/groups/groupId/agenda/export', () => {
  it('it should export a groups agenda when user is authenticated and group member', done => {
    User.findOne({ email: 'test@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/agenda/export`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})
describe('/Post/api/groups/groupId/agenda/export', () => {
  it('it should not export a groups agenda when user isnt authenticated', done => {
    Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
      chai
        .request(server)
        .post(`/api/groups/${group.group_id}/agenda/export`)
        .set('Authorization', 'invalidtoken')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Post/api/groups/groupId/agenda/export', () => {
  it('it should not export a groups agenda when user isnt group member', done => {
    User.findOne({ email: 'test4@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/agenda/export`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
})
describe('/Post/api/groups/groupId/agenda/export', () => {
  it('it should not export a groups agenda for a non existing group', done => {
    User.findOne({ email: 'test4@email.com' }, (err, user) => {
      chai
        .request(server)
        .post(`/api/groups/invalidid/agenda/export`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
describe('/Post/api/groups/groupId/agenda/export', () => {
  it('it should not export a groups agenda when group has no activities', done => {
    User.findOne({ email: 'test3@email.com' }, (err, user) => {
      Group.findOne({ name: 'Test Group 2' }, (err, group) => {
        chai
          .request(server)
          .post(`/api/groups/${group.group_id}/agenda/export`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(404)
            done()
          })
      })
    })
  })
})
