const Profile = require('../models/profile');
const Notification = require('../models/notification');
const Settings = require('../models/group-settings');
const Member = require('../models/member');
const Group = require('../models/group');
const Device = require('../models/device');
var fbadmin = require('firebase-admin');
const texts = require('../constants/notification-texts')


fbadmin.initializeApp({
	credential: fbadmin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
	})
})

async function newMemberNotification(group_id, user_id) {
	const group = await Group.findOne({ group_id })
	const profile = await Profile.findOne({ user_id })
	const members = await Member.find({ group_accepted: true, user_accepted: true, group_id: group_id })
	if (profile && group) {
		const notifications = []
		members.forEach(member => {
			const notification = {
				owner_type: 'user',
				owner_id: member.user_id,
				type: 'group',
				read: false
			}
			if (member.user_id !== user_id) {
				notification.code = 0
				notification.subject = `${profile.given_name} ${profile.family_name}`
				notification.object = group.name
			} else {
				notification.code = 1
				notification.subject = ''
				notification.object = group.name
			}
			notifications.push(notification)
		})
		await Notification.create(notifications)
		console.log('New member notification created')
	}
};

async function editGroupNotification(group_id, user_id, changes) {
	const group = await Group.findOne({ group_id });
	const settings = await Settings.findOne({ group_id });
	const profile = await Profile.findOne({ user_id });
	if (profile && group) {
		const notifications = [];
		if (changes.file) {
			notifications.push({
				owner_type: 'group',
				owner_id: group_id,
				type: 'group',
				code: 3,
				read: false,
				subject: `${profile.given_name} ${profile.family_name}`,
			})
		}
		if (changes.name !== group.name) {
			notifications.push({
				owner_type: 'group',
				owner_id: group_id,
				type: 'group',
				code: 4,
				read: false,
				subject: `${profile.given_name} ${profile.family_name}`,
			})
		}
		changes.visible = changes.visible==='true'
		if (changes.visible !== settings.visible) {

			if (changes.visible) {
				notifications.push({
					owner_type: 'group',
					owner_id: group_id,
					type: 'group',
					code: 7,
					read: false,
					subject: `${profile.given_name} ${profile.family_name}`,
				})
			} else {
				console.log("OOOOOOO")
				notifications.push({
					owner_type: 'group',
					owner_id: group_id,
					type: 'group',
					code: 6,
					read: false,
					subject: `${profile.given_name} ${profile.family_name}`,
				})
			}
		}
		await Notification.create(notifications);
		console.log('Edit Group Notification created');
	}
};

async function removeMemberNotification(user_id, member_id, group_id) {
	const subject = await Profile.findOne({ user_id });
	const object = await Profile.findOne({ user_id: member_id });
	if (subject && object) {
		await Notification.create({
			owner_type: 'group',
			owner_id: group_id,
			type: 'group',
			code: 5,
			read: false,
			subject: `${subject.given_name} ${subject.family_name}`,
			object: `${object.given_name} ${object.family_name}`
		});
		console.log('Remove member Notification created');
	}
};

async function timeslotRequirementsNotification(timeslotName, groupName, participants) {
	const devices = await Device.find({ user_id: { $in: participants } });
	const notification = `Timeslot '${timeslotName}' of group '${groupName} has met all its requirements.'`
	devices.forEach((device) => {
		const message = {
			notification: { title: 'Timeslot Notification', body: notification },
			token: device.device_id
		}
		fbadmin.messaging().send(message)
			.then(() => { })
			.catch((error) => {
				if (error.code === 'messaging/registration-token-not-registered') {
					Device.deleteOne({ device_id: device.device_id })
				}
			})
	})
}

const getNotificationDescription = (notification, language) => {
	const {
		type, code, subject, object
	} = notification
	const { description } = texts[language][type][code]

	switch (type) {
		case 'group':
			switch (code) {
				case 0:
					return `${subject}${description}${object}`
				case 1:
					return `${description}${object}`
				default:
					return ''
				case 2:
					return description
				case 3:
					return `${subject} ${description}`
				case 4:
					return `${subject} ${description}`
				case 5:
					return `${subject} ${description} ${object}`
				case 6:
					return `${subject} ${description}.`
				case 7:
					return `${subject} ${description}.`
			}
		default:
			return ''
	}
}

module.exports = {
	newMemberNotification,
	timeslotRequirementsNotification,
	editGroupNotification,
	getNotificationDescription,
	removeMemberNotification
}
