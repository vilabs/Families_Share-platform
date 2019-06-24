const Profile = require('../models/profile')
const Notification = require('../models/notification')
const Settings = require('../models/group-settings')
const Member = require('../models/member')
const Group = require('../models/group')
const Device = require('../models/device')
const User = require('../models/user')
const texts = require('../constants/notification-texts')

const { Expo } = require('expo-server-sdk')
let expo = new Expo()

async function newMemberNotification (group_id, user_id) {
  const group = await Group.findOne({ group_id })
  const profile = await Profile.findOne({ user_id })
  const members = await Member.find({ group_id, group_accepted: true, user_accepted: true })
  if (profile && group) {
    const notifications = []
    members.forEach(member => {
      const notification = {
        owner_type: 'user',
        owner_id: member.user_id,
        type: 'members',
        read: false
      }
      if (member.user_id !== user_id) {
        notification.code = 0
        notification.subject = `${profile.given_name} ${profile.family_name}`
        notification.object = group.name
      } else {
        notification.code = 1
        notification.object = group.name
      }
      notifications.push(notification)
    })
    await Notification.create(notifications)
    console.log('New member notification created')
  }
};

async function newActivityNotification (group_id, user_id) {
  const object = await Group.findOne({ group_id })
  const subject = await Profile.findOne({ user_id })
  const members = await Member.find({ group_id, user_id: { $ne: user_id }, group_accepted: true, user_accepted: true })
  if (subject && object) {
    const notifications = []
    members.forEach(member => {
      notifications.push({
        owner_type: 'user',
        owner_id: member.user_id,
        type: 'activities',
        code: 0,
        read: false,
        subject: `${subject.given_name} ${subject.family_name}`,
        object: `${object.name}`
      })
    })
    await Notification.create(notifications)
    console.log('New activity notification created')
  }
};

async function newAnnouncementNotification (group_id, user_id) {
  const object = await Group.findOne({ group_id })
  const subject = await Profile.findOne({ user_id })
  const members = await Member.find({ group_id, user_id: { $ne: user_id }, group_accepted: true, user_accepted: true }).distinct('user_id')
  const users = await User.find({ user_id: { $in: members } })
  const devices = await Device.find({ user_id: { $in: members } })
  if (subject && object) {
    const notifications = []
    members.forEach(member => {
      notifications.push({
        owner_type: 'user',
        owner_id: member.user_id,
        type: 'announcements',
        code: 0,
        read: false,
        subject: `${subject.given_name} ${subject.family_name}`,
        object: `${object.name}`
      })
    })
    await Notification.create(notifications)
    const messages = []
    devices.forEach(device => {
      const language = users.filter(user => user.user_id === device.user_id)[0].language
      messages.push({
        to: device.device_id,
        sound: 'default',
        title: texts[language]['announcements'][0]['header'],
        body: `${subject} ${texts[language]['announcements'][0]['description']} ${object}`
      })
    })
    await sendPushNotifications(messages)
  }
};

async function editGroupNotification (group_id, user_id, changes) {
  const group = await Group.findOne({ group_id })
  const settings = await Settings.findOne({ group_id })
  const profile = await Profile.findOne({ user_id })
  if (profile && group) {
    const notifications = []
    if (changes.file) {
      notifications.push({
        owner_type: 'group',
        owner_id: group_id,
        type: 'group',
        code: 0,
        read: false,
        subject: `${profile.given_name} ${profile.family_name}`
      })
    }
    if (changes.name !== group.name) {
      notifications.push({
        owner_type: 'group',
        owner_id: group_id,
        type: 'group',
        code: 1,
        read: false,
        subject: `${profile.given_name} ${profile.family_name}`
      })
    }
    changes.visible = changes.visible === 'true'
    if (changes.visible !== settings.visible) {
      if (changes.visible) {
        notifications.push({
          owner_type: 'group',
          owner_id: group_id,
          type: 'group',
          code: 3,
          read: false,
          subject: `${profile.given_name} ${profile.family_name}`
        })
      } else {
        notifications.push({
          owner_type: 'group',
          owner_id: group_id,
          type: 'group',
          code: 2,
          read: false,
          subject: `${profile.given_name} ${profile.family_name}`
        })
      }
    }
    if (changes.description !== settings.description) {
      notifications.push({
        owner_type: 'group',
        owner_id: group_id,
        type: 'group',
        code: 4,
        read: false,
        subject: `${profile.given_name} ${profile.family_name}`
      })
    }
    await Notification.create(notifications)
    console.log('Edit Group Notification created')
  }
};

async function removeMemberNotification (member_id, group_id) {
  const subject = await Profile.findOne({ user_id: member_id })
  const object = await Group.findOne({ group_id })
  const members = await Member.find({ group_id, group_accepted: true, user_accepted: true })
  if (subject && object) {
    const notifications = [{
      owner_type: 'user',
      owner_id: member_id,
      type: 'members',
      code: 3,
      read: false,
      object: `${object.name}`
    }]
    members.forEach(member => {
      notifications.push({
        owner_type: 'user',
        owner_id: member.user_id,
        type: 'members',
        code: 2,
        read: false,
        subject: `${subject.given_name} ${subject.family_name}`,
        object: `${object.name}`
      })
    })
    await Notification.create(notifications)
  }
  console.log('Remove member Notification created')
};

async function timeslotRequirementsNotification (timeslotName, participants) {
  const devices = await Device.find({ user_id: { $in: participants } })
  const users = await User.find({ user_id: { $in: participants } })
  const notifications = []
  users.forEach(user => {
    notifications.push({
      owner_type: 'user',
      owner_id: user.user_id,
      type: 'activities',
      code: 1,
      read: false,
      subject: `${timeslotName}`
    })
  })
  await Notification.create(notifications)
  const messages = []
  devices.forEach(device => {
    const language = users.filter(user => user.user_id === device.user_id)[0].language
    messages.push({
      to: device.device_id,
      sound: 'default',
      title: texts[language]['activities'][1]['header'],
      body: `${timeslotName} ${texts[language]['activities'][1]['description']}`
    })
  })
  await sendPushNotifications(messages)
}

async function timeslotChangedNotification (timeslotName, participants) {
  const devices = await Device.find({ user_id: { $in: participants } })
  const users = await User.find({ user_id: { $in: participants } })
  const notifications = []
  users.forEach(user => {
    notifications.push({
      owner_type: 'user',
      owner_id: user.user_id,
      type: 'activities',
      code: 2,
      read: false,
      subject: `${timeslotName}`
    })
  })
  await Notification.create(notifications)
  const messages = []
  devices.forEach(device => {
    const language = users.filter(user => user.user_id === device.user_id)[0].language
    messages.push({
      to: device.device_id,
      sound: 'default',
      title: texts[language]['activities'][2]['header'],
      body: `${timeslotName} ${texts[language]['activities'][2]['description']}`
    })
  })
  await sendPushNotifications(messages)
}

async function newRequestNotification (user_id, group_id) {
  const admins = await Member.find({ group_id, user_accepted: true, group_accepted: true, admin: true }).distinct('user_id')
  const users = await User.find({ user_id: { $in: admins } })
  const user = await Profile.findOne({ user_id })
  const group = await Group.findOne({ group_id })
  const devices = await Device.find({ user_id: { $in: admins } })
  const messages = []
  devices.forEach(device => {
    const language = users.filter(user => user.user_id === device.user_id)[0].language
    messages.push({
      to: device.device_id,
      sound: 'default',
      title: texts[language]['members'][4]['header'],
      body: `${user.give_name} ${user.family_name} ${texts[language]['members'][4]['description']} ${group.name}`
    })
  })
  await sendPushNotifications(messages)
}

async function getNotificationDescription (notification, language) {
  const {
    type, code, subject, object
  } = notification
  const { description } = texts[language][type][code]

  switch (type) {
    case 'group':
      switch (code) {
        case 0:
          return `${subject} ${description}`
        case 1:
          return `${subject} ${description}`
        case 2:
          return `${subject} ${description}`
        case 3:
          return `${subject} ${description}`
        case 4:
          return `${subject} ${description}`
        default:
          return ''
      }
    case 'members':
      switch (code) {
        case 0:
          return `${subject} ${description} ${object}.`
        case 1:
          return `${subject} ${description}`
        case 2:
          return `${subject} ${description} ${object}.`
        case 3:
          return `${description} ${object}.`
        default:
          return ''
      }
    case 'activities':
      switch (code) {
        case 0:
          return `${subject} ${description} ${object}.`
        case 1:
          return `${subject} ${description}`
        case 2:
          return `${subject} ${description}`
        default:
          return ''
      }
    case 'announcements':
      switch (code) {
        case 0:
          return `${subject} ${description} ${object}.`
        default:
          return ''
      }
    default:
      return ''
  }
}

async function sendPushNotifications (messages) {
  const invalidTokens = []
  const notifications = []
  messages.forEach(message => {
    if (!Expo.isExpoPushToken(message.to)) {
      notifications.push(message)
    } else {
      invalidTokens.push(message.to)
    }
  })
  let chunks = expo.chunkPushNotifications(messages)
  let tickets = []
  for (let chunk of chunks) {
    let ticketChunk = await expo.sendPushNotificationsAsync(chunk)
    tickets.push(...ticketChunk)
  }
  await Device.deleteMany({ device_id: { $in: invalidTokens } })
}

module.exports = {
  newMemberNotification,
  timeslotRequirementsNotification,
  editGroupNotification,
  getNotificationDescription,
  removeMemberNotification,
  newActivityNotification,
  newAnnouncementNotification,
  timeslotChangedNotification,
  newRequestNotification
}
