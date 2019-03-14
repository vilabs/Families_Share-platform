const Profile = require('../models/profile');
const Notification = require('../models/notification');
const Settings = require('../models/group-settings');
const Member = require('../models/member');
const Group = require('../models/group');
const Device = require('../models/device');
const User = require('../models/user');
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

async function newActivityNotification(group_id, user_id) {
	const object = await Group.findOne({ group_id })
	const subject = await Profile.findOne({ user_id })
	const members = await Member.find({ group_id, user_id: { $ne: user_id } ,group_accepted: true, user_accepted: true })
	if (subject && object) {
		const notifications = []
		members.forEach( member => {
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
		console.log('New member notification created')
	}
};

async function newAnnouncementNotification(group_id, user_id) {
	const object = await Group.findOne({ group_id });
	const subject = await Profile.findOne({ user_id });
	const members = await Member.find({ group_id, user_id: { $ne: user_id } ,group_accepted: true, user_accepted: true })
	if (subject && object) {
		const notifications = []
		members.forEach( member => {
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
				code: 1,
				read: false,
				subject: `${profile.given_name} ${profile.family_name}`,
			})
		}
		if (changes.name !== group.name) {
			notifications.push({
				owner_type: 'group',
				owner_id: group_id,
				type: 'group',
				code: 2,
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
					code: 4,
					read: false,
					subject: `${profile.given_name} ${profile.family_name}`,
				})
			} else {
				notifications.push({
					owner_type: 'group',
					owner_id: group_id,
					type: 'group',
					code: 3,
					read: false,
					subject: `${profile.given_name} ${profile.family_name}`,
				})
			}
		}
		if (changes.description !== settings.description){
			notifications.push({
				owner_type: 'group',
				owner_id: group_id,
				type: 'group',
				code: 5,
				read: false,
				subject: `${profile.given_name} ${profile.family_name}`,
			})
		}
		await Notification.create(notifications);
		console.log('Edit Group Notification created');
	}
};

async function removeMemberNotification(member_id, group_id) {
	const subject = await Profile.findOne({ user_id: member_id });
	const object= await Group.findOne({ group_id});
	const members = await Member.find({ group_id, group_accepted: true, user_accepted: true });
	if (subject && object) {
		const notifications = [{
			owner_type: 'user',
			owner_id: member_id,
			type: 'members',
			code: 3,
			read: false,
			object: `${object.name}`
		}];
		members.forEach( member => {
			notifications.push({
				owner_type: 'user',
				owner_id: member.user_id,
				type: 'members',
				code: 2,
				read: false,
				subject: `${subject.given_name} ${subject.family_name}`,
				object: `${object.name}`
			});
		});
		await Notification.create(notifications);
		}
		console.log('Remove member Notification created');
};

async function timeslotRequirementsNotification(timeslotName, participants) {
	const devices = await Device.find({ user_id: { $in: participants } });
	const users = await User.find({ user_id: {$in: participants }});
	const notifications = [];
	users.forEach( user => {
		notifications.push({
			owner_type: 'user',
			owner_id: user.user_id,
			type: 'activities',
			code: 1,
			read: false,
			subject: `${timeslotName}`
		})
	})
	await Notification.create(notifications);
	devices.forEach((device,index) => {
		const message = {
			notification: { title: texts[users[index].language]['activities'][1]['header'], body: texts[users[index].language]['activities'][1]['description'] },
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
					return description;
				case 1:
					return `${subject} ${description}`
				case 2:
					return `${subject} ${description}`
				case 3:
					return `${subject} ${description}`
				case 4:
					return `${subject} ${description}`
				case 5:
					return `${subject} ${description}`
				default: 
					return ''
			}
		case 'members':
			switch (code) {
				case 0:
					return `${subject} ${description} ${object}.`
				case 1:
					return `${subject} ${description}.`
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
					return `${subject} ${description}.`
				default: 
					return ''
			}
		case 'announcements': 
			switch (code){
				case 0: 
					return `${subject} ${description} ${object}.`
				default: 
					return ''
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
	removeMemberNotification,
	newActivityNotification,
	newAnnouncementNotification
}
