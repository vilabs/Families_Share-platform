const common = require('./common')

const { chai } = common
const { server } = common

const Profile = require('../src/models/profile')
const Address = require('../src/models/address')
const Image = require('../src/models/image')
const User = require('../src/models/user')
const Rating = require('../src/models/rating')
const Device = require('../src/models/device')
const Group = require('../src/models/group')
const Group_Settings = require('../src/models/group-settings')
const Password_Reset = require('../src/models/password-reset')
const Member = require('../src/models/member')
const Notification = require('../src/models/notification')
const Parent = require('../src/models/parent')
const Child = require('../src/models/child')
const Activity = require('../src/models/activity')
const Announcement = require('../src/models/announcement')
const Reply = require('../src/models/reply')

const importTest = (name, path) => {
  describe(name, () => {
    require(path)
  })
}

const initializeDB = async () => {
  const user2 = {
    given_name: 'Test',
    family_name: 'User2',
    number: '0123546879',
    email: 'test2@email.com',
    password: 'password',
    visible: true,
    language: 'en'
  }
  const user3 = {
    given_name: 'Test',
    family_name: 'User3',
    number: '0123546879',
    email: 'test3@email.com',
    password: 'password',
    visible: true,
    language: 'en'
  }
  await chai.request(server).post('/api/users').send(user2)
  await chai.request(server).post('/api/users').send(user3)
  const user = await User.findOne({ email: 'test3@email.com' })
  const group2 = {
    name: 'Test Group 2',
    description: 'Also awesome group',
    visible: true,
    location: 'Kuala lumpur',
    owner_id: user.user_id,
    invite_ids: [],
    contact_type: 'email',
    contact_info: 'yolo@email.com'
  }
  const group3 = {
    name: 'Test Group 3',
    description: 'Again an awesome group',
    visible: true,
    location: 'Kuala lumpur',
    owner_id: user.user_id,
    invite_ids: [],
    contact_type: 'phone',
    contact_info: '65485748'
  }
  await chai.request(server).post('/api/groups').send(group2).set('Authorization', user.token)
  await chai.request(server).post('/api/groups').send(group3).set('Authorization', user.token)
  const group = await Group.findOne({ name: 'Test Group 2' })
  const activity = {
    group_id: group.group_id,
    creator_id: user.user_id,
    name: 'Test Activity 2',
    color: '#00838F',
    description: 'test',
    location: 'Kuala lumpur',
    repetition: true,
    repetition_type: 'weekly',
    different_timeslots: false
  }
  const events = [
    {
      description: 'Test timeslot',
      location: 'Kuala lumpur',
      summary: 'Test timeslot',
      start: {
        dateTime: '2019-03-06T22:00:00.000Z',
        date: null
      },
      end: {
        dateTime: '2019-03-06T23:00:00.000Z',
        date: null
      },
      extendedProperties: {
        shared: {
          requiredParents: 4,
          requiredChildren: 10,
          cost: 10,
          parents: JSON.stringify([]),
          children: JSON.stringify([]),
          status: 'proposed',
          activityColor: '#00838F',
          groupId: group.group_id,
          repetition: 'weekly'
        }
      }
    },
    {
      description: 'Test timeslot',
      location: 'Kuala lumpur',
      summary: 'Test timeslot',
      start: {
        dateTime: '2019-03-13T22:00:00.000Z',
        date: null
      },
      end: {
        dateTime: '2019-03-13T23:00:00.000Z',
        date: null
      },
      extendedProperties: {
        shared: {
          requiredParents: 4,
          requiredChildren: 10,
          cost: 10,
          parents: JSON.stringify([]),
          children: JSON.stringify([]),
          status: 'proposed',
          activityColor: '#00838F',
          groupId: group.group_id,
          repetition: 'weekly'
        }
      }
    },
    {
      description: 'Test timeslot',
      location: 'Kuala lumpur',
      summary: 'Test timeslot',
      start: {
        dateTime: '2019-03-20T22:00:00.000Z',
        date: null
      },
      end: {
        dateTime: '2019-03-20T23:00:00.000Z',
        date: null
      },
      extendedProperties: {
        shared: {
          requiredParents: 4,
          requiredChildren: 10,
          cost: 10,
          parents: JSON.stringify([]),
          children: JSON.stringify([]),
          status: 'proposed',
          activityColor: '#00838F',
          groupId: group.group_id,
          repetition: 'weekly'
        }
      }
    },
    {
      description: 'Test timeslot',
      location: 'Kuala lumpur',
      summary: 'Test timeslot',
      start: {
        dateTime: '2019-03-27T22:00:00.000Z',
        date: null
      },
      end: {
        dateTime: '2019-03-27T23:00:00.000Z',
        date: null
      },
      extendedProperties: {
        shared: {
          requiredParents: 4,
          requiredChildren: 10,
          cost: 10,
          parents: JSON.stringify([]),
          children: JSON.stringify([]),
          status: 'proposed',
          activityColor: '#00838F',
          groupId: group.group_id,
          repetition: 'weekly'
        }
      }
    }
  ]
  await chai.request(server).post(`/api/groups/${group.group_id}/activities`).send({ activity, events }).set('Authorization', user.token)
  const announcement = {
    message: 'Test Announcement 2'
  }
  await chai.request(server).post(`/api/groups/${group.group_id}/announcements`).send(announcement).set('Authorization', user.token)
  const child = {
    given_name: 'Test',
    family_name: 'Child',
    gender: 'girl',
    birthdate: new Date(),
    allergies: 'allergic to peanuts',
    special_needs: 'no',
    other_info: 'no'
  }
  await chai.request(server).post(`/api/users/${user.user_id}/children`).send(child).set('Authorization', user.token)
}
describe('Test', () => {
  before('Initializing DB', async () => {
    await initializeDB()
  })

  importTest('User Endpoints Test', './Users/userEndpoints')
  importTest('Group Endpoints Test', './Groups/groupEndpoints')
  importTest('Users Groups Endpoints Test', './Users/groupEndpoints')
  importTest('Users Profile Endpoints Test', './Users/profileEndpoints')
  importTest('Users Children Endpoints Test', './Users/childrenEndpoints')
  importTest('Group Members Endpoints Test', './Groups/memberEndpoints')
  importTest('Group Various Endpoints Test', './Groups/variousEndpoints')
  importTest('Group Various Endpoints Test', './Groups/activityEndpoints')
  importTest('Group Announcement Endpoints Test', './Groups/announcementEndpoints')
  importTest('User Various Endpoints Test', './Users/variousEndpoints')
  importTest('Child Endpoints Test', './Children/childEndpoints')
  importTest('Profile Endpoints Test', './Profiles/profileEndpoints')
  importTest('Community Endpoints Test', './Community/communityEndpoints')

  after('Cleaning up', async () => {
    await User.deleteMany({})
    await Profile.deleteMany({})
    await Image.deleteMany({})
    await Rating.deleteMany({})
    await Address.deleteMany({})
    await Device.deleteMany({})
    await Password_Reset.deleteMany({})
    await Group.deleteMany({})
    await Group_Settings.deleteMany({})
    await Member.deleteMany({})
    await Notification.deleteMany({})
    await Parent.deleteMany({})
    await Child.deleteMany({})
    await Activity.deleteMany({})
    await Reply.deleteMany({})
    await Announcement.deleteMany({})
  })
})
