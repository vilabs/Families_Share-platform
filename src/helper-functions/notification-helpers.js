const Profile = require('../models/profile');
const Notification = require('../models/notification');
const Member = require('../models/member');
const Group = require('../models/group');
var fbadmin = require('firebase-admin');

fbadmin.initializeApp({
  credential: fbadmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
});


async function newMemberNotification(group_id, user_id) {
	try {
		const group = await Group.findOne({ group_id: group_id });
		const profile = await Profile.findOne({ user_id: user_id });
		const members = await Member.find({ group_accepted: true, user_accepted: true, group_id: group_id })
		if (profile && group && members) {
			const notifications = [];
			members.forEach(member => {
				const notification = {
					owner_type: "user",
					owner_id: member.user_id,
					type: "group",
					read: false,
				};
				if (member.user_id !== user_id) {
					notification.code = 0
					notification.subject = `${profile.given_name} ${profile.family_name}`
					notification.object = group.name
				} else {
					notification.code = 1
					notification.subject = ''
					notification.object = group.name;
				}
				notifications.push(notification);
			});
			await Notification.create(notifications)
			console.log("New member notification created");
		}
	} catch (error) {
		console.log(error)
	}
};


module.exports = {
	newMemberNotification: newMemberNotification,
};