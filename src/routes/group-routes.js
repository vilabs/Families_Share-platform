const express = require('express');
const router = new express.Router();
const multer = require('multer');
const objectid = require('objectid');
const nh = require('../helper-functions/notification-helpers');
const fr = require('find-remove');
const { google } = require('googleapis');
const moment = require('moment');
const groupAgenda = require('../helper-functions/group-agenda');
const exportActivity = require('../helper-functions/export-activity-data');
const nodemailer = require('nodemailer');
const scopes = 'https://www.googleapis.com/auth/calendar';
const jwt = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes)
const path = require('path');
const sharp = require('sharp')



const insertGroupEvent = (event, calId) =>{
	return new Promise( (resolve,reject) => {
		calendar.events.insert({ calendarId: calId, resource: event }, (err,response)=> {
					if(err) {
							reject(err)
					} else {
						resolve(response.data.id);  
					}
			})
	})
}

const calendar = google.calendar({
	version: 'v3',
	auth: jwt,
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.SERVER_MAIL,
		pass: process.env.SERVER_MAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false
	}
});

const groupStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../images/groups'))
	},
	filename: function (req, file, cb) {
		const fileName = req.params.id + '-' + Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf("/") + 1, file.mimetype.length)
		fr(path.join(__dirname, '../../images/groups'), { prefix: req.params.id })
		cb(null, fileName)
	}
});
const groupUpload = multer({ storage: groupStorage });

const announcementStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../images/announcements'))
	},
	filename: function (req, file, cb) {
		if (req.params.announcement_id === undefined) {
			req.params.announcement_id = objectid()
		}
		cb(null, req.params.announcement_id + '-' + Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf("/") + 1, file.mimetype.length))
	}
});
const announcementUpload = multer({ storage: announcementStorage});

const Image = require('../models/image');
const Reply = require('../models/reply');
const Group_Settings = require('../models/group-settings');
const Member = require('../models/member');
const Group = require('../models/group');
const Notification = require('../models/notification');
const Announcement = require('../models/announcement');
const Parent = require('../models/parent');
const Activity = require('../models/activity');
const Day = require('../models/day');
const Child = require('../models/child');
const Profile = require('../models/profile')

router.get('/', (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const query = req.query;
	if (query.searchBy !== undefined) {
		switch (query.searchBy) {
			case "visibility":
				Group_Settings.find({ visible: query.visible }, (settingsError, visibleGroups) => {
					if (settingsError) next(settingsError)
					if (visibleGroups.length > 0) {
						const groupIds = [];
						visibleGroups.forEach(group => groupIds.push(group.group_id));
						Group.find({ group_id: { $in: groupIds }})
						.collation({locale:'en'})
						.sort({'name':1})
						.exec( (groupsError, groups) => {
							if (groupsError) {
								res.status(400).send("Something went wrong");
							}
							if (groups) {
								res.json(groups);
							} else {
								res.status(400).send("Something went wrong")
							}
						});
					} else {
						res.status(404).send("No visible groups found")
					}
				})
				break;
			case "ids":
				const groupIds = req.query.ids;
				Group.find({ group_id: { $in: groupIds } })
				.populate('image')
				.exec( (groupsError, groups) => {
					if (groupsError) next(groupsError)
					if (groups.length>0) {
						res.json(groups);
					} else {
						res.status(404).send("Something went wrong")
					}
				});
				break;
			default:
				res.status(400).send("Something went wrong")
		}
	} else {
		Group.find(query, (error, groups) => {
			if (error) next(error)
			return res.json(groups);
		})
	}
});

router.post('/', (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const { invite_ids, description, location, name, visible, owner_id } = req.body
	if ((invite_ids && description && location && name && visible!==undefined && owner_id)) {
		const group_id = objectid();
		const image_id = objectid();
		const settings_id = objectid();
		const newCal = {
			summary: name,
			description: description,
			location: location,
		};
		const group = {
			group_id: group_id,
			name: name,
			description: description,
			background: "#afdddd",
			location: location,
			owner_id: owner_id,
			settings_id: settings_id,
			image_id: image_id,
		};
		const image = {
			image_id: image_id,
			owner_type: "group",
			owner_id: group_id,
			path: "/images/groups/group_default_photo.png",
			thumbnail_path: "/images/groups/group_default_photo.png"
		};
		const settings = {
			settings_id: settings_id,
			group_id: group_id,
			visible: visible,
			open: true,
		};
		const members = [{
			group_id: group_id,
			user_id: owner_id,
			admin: true,
			group_accepted: true,
			user_accepted: true,
		}];
		invite_ids.forEach(invite_id => {
			members.push({
				group_id: group_id,
				user_id: invite_id,
				admin: false,
				group_accepted: true,
				user_accepted: false,
			});
		})
		calendar.calendars.insert({ resource: newCal }, async (error, response) => {
			if(error) next(error);
			try{
			group.calendar_id = response.data.id;
			await Member.create(members);
			await Group.create(group);
			await Image.create(image);
			await Group_Settings.create(settings);
			res.status(200).send("Group Created");
			} catch (err) {
				next(err)
			}
		})
	} else {
		res.status(400).send("Something went wrong")
	}
});

router.get('/suggestions', (req, res, next) => {
	Group_Settings.find({ visible: true }, (error, groups) => {
		if (error) next(error);
		if (groups.length > 0) {
			const noOfSuggestions = groups.length > 2 ? 3 : groups.length;
			const suggestions = [];
			for (let i = groups.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[groups[i], groups[j]] = [groups[j], groups[i]];
			}
			for (let i = 0; i < noOfSuggestions; i++) {
				suggestions.push(groups[i].group_id)
			}
			res.json(suggestions);
		} else {
			return res.status(404).send("no suggestions found")
		}
	})
});

router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	Group.findOne({ group_id: id })
		.populate('image')
		.lean().exec((error, group) => {
			if (error) next(error)
			if (group) {
				res.json(group);
			} else {
				res.status(404).send("Group not found")
			}
		})
});

router.delete('/:id', async (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const id = req.params.id;
	const edittingUser = await Member.findOne({ group_id: req.params.id, user_id: req.user_id })
	if (edittingUser) {
		if (edittingUser.group_accepted && edittingUser.user_accepted && edittingUser.admin) {
			try {
				await Group.findOne({ group_id: id }, (err, group) => {
					calendar.calendars.delete({ calendarId: group.calendar_id })
				})
				await Group.deleteOne({ group_id: id });
				await Member.deleteMany({ group_id: id });
				await Group_Settings.deleteOne({ group_id: id });
				await Image.deleteMany({ owner_type: "group", owner_id: id })
				res.status(200).send("Group was deleted");
			} catch (error) {
				res.status(400).send("Something went wrong")
			}
		} else {
			res.status(401).send('Unauthorized')
		}
	}
	else {
		res.status(401).send('Unauthorized')
	}
})

router.patch('/:id', groupUpload.single('photo'), async (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const file = req.file
	const id = req.params.id;
	const { visible, name, description, location, background } = req.body;
	if (visible !== undefined && name && description && location && background) {
		const settingsPatch = { visible };
		const groupPatch = {
			name,
			description,
			background,
			location,
		};
		try {
			const edittingUser = await Member.findOne({ group_id: req.params.id, user_id: req.user_id })
			if (edittingUser) {
				if (edittingUser.group_accepted && edittingUser.user_accepted && edittingUser.admin) {
					await Group.updateOne({ group_id: id }, groupPatch)
					await Group_Settings.updateOne({ group_id: id }, settingsPatch);
					if (file) {
						const fileName = file.filename.split('.')
						const imagePatch = {
							path: `/images/groups/${file.filename}`,
							thumbnail_path: `/images/groups/${fileName[0]}_t.${fileName[1]}`,
						};
						sharp(path.join(__dirname, `../../images/groups/${file.filename}`))
							.resize({
								height: 200,
								fit: sharp.fit.cover,
							})
							.toFile(path.join(__dirname, `../../images/groups/${fileName[0]}_t.${fileName[1]}`), async (err) => {
								if (err) res.status(400).send(err);
								await Image.updateOne({ owner_type: "group", owner_id: id }, imagePatch);
								res.status(200).send("Group Updated");
							})
					} else {
						res.status(200).send("Group Updated");
					}
				} else {
					res.status(401).send("Unauthorized")
				}
			} else {
				res.status(401).send("Unauthorized")
			}
		} catch (err) {
			next(err);
		}
	} else {
		res.status(400).send("Something went wrong")
	}
});

router.patch('/:id/settings', async (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const id = req.params.id;
	const settingsPatch = req.body;
	try {
		const edittingUser = await Member.findOne({ group_id: req.params.id, user_id: req.user_id })
		if (edittingUser) {
			if (edittingUser.group_accepted && edittingUser.user_accepted && edittingUser.admin) {
				await Group_Settings.updateOne({ group_id: id }, settingsPatch);
				res.status(200).send("Settings Updated");
			} else {
				res.status(401).send("Unauthorized")
			}
		} else {
			res.status(401).send("Unauthorized")
		}
	} catch (error) {
		next(error);
	}
});

router.get('/:id/settings', (req, res, next) => {
	const id = req.params.id;
	Group_Settings.findOne({ group_id: id }, (error, settings) => {
		if (error) next(error);
		if (settings) {
			res.json(settings);
		} else {
			res.status(404).send("Group Settings not found")
		}
	})
});

router.get('/:id/members', (req, res) => {
	const id = req.params.id;
	Member.find({ "group_id": id }, (error, members) => {
		if (error) {
			res.status(400).send("Something went wrong");
		}
		if (members.length > 0) {
			res.send(members);
		} else {
			res.status(404).send("Group has no members")
		}
	})
});

router.patch('/:id/members', (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.id;
	const user_id = req.body.id;
	const patch = req.body.patch;
	Member.updateOne({ user_id: user_id, group_id: group_id }, patch, (err, raw) => {
		if (err) res.status(400).send("Something went wrong")
		if (patch.group_accepted !== undefined) {
			if (patch.group_accepted) {
				nh.newMemberNotification(group_id, user_id);
				res.status(200).send("Request confirmed")
			} else {
				res.status(200).send("Request deleted")
			}
		} else {
			if (patch.admin) {
				res.status(200).send("Admin added");
			} else {
				res.status(200).send("Admin removed");
			}
		}
	});
});

router.delete('/:id/members', async (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	try{
		const group_id = req.params.id;
		const user_id = req.query.id;
		const children = await Parent.find({ parent_id: user_id});
		const usersChildrenIds = children.map( child => child.child_id )
		const group = await Group.findOne({ group_id: group_id });
		await calendar.events.list({ calendarId: group.calendar_id }, async (err, resp) => {
			if (err) res.status(400).send("Something went wrong");
			const events = resp.data.items.filter(event => event.extendedProperties.shared.status !== "completed")
			events.forEach( event => {
				const parentIds = JSON.parse(event.extendedProperties.shared.parents);
				event.extendedProperties.shared.parents = JSON.stringify(parentIds.filter(id => id!==user_id))
				const childrenIds = JSON.parse(event.extendedProperties.shared.children);
				event.extendedProperties.shared.children = JSON.stringify(childrenIds.filter(id => usersChildrenIds.indexOf(id)===-1))
			})
			await Promise.all(events.map((event) => {
				const timeslotPatch = {
					extendedProperties: {
						shared: {
							parents: event.extendedProperties.shared.parents,
							children: event.extendedProperties.shared.children,
						}
					}
				}
				calendar.events.patch({ calendarId: group.calendar_id, eventId: event.id, resource: timeslotPatch })
			}))
			await Member.deleteOne({ user_id: user_id, group_id: group_id })
			res.status(200).send("User removed from group")
		})
		} catch (error) {
			console.log(error)
			res.status(400).send("Something went wrong")
		}
});

router.post('/:id/members', async (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.id;
	const userIds = req.body.inviteIds;
	try {
		const edittingUser = await Member.findOne({ group_id: group_id, user_id: req.user_id });
		if (edittingUser) {
			if (edittingUser.group_accepted && edittingUser.user_accepted && edittingUser.admin) {
				const members = await Member.find({ group_id: group_id, user_id: { $in: userIds }});
				for (const member of members){
						userIds.splice(userIds.indexOf(member.used_id), 1)
						if(!member.group_accepted){
							member.group_accepted = true;
							await member.save();
						}
					}
				await Member.create(
					userIds.map(id => {
						return {
							user_id: id,
							group_id,
							admin: false,
							group_accepted: true,
							user_accepted: false,
						}
					})
			  );
				res.status(200).send("Members invited");
			} else {
				return res.status(401).send('Not authenticated')
			}
		} else {
			return res.status(401).send('Not authenticated')
		}
	} catch (error) {
		next(error);
	}
});

router.get('/:id/kids', (req, res) => {
	const id = req.params.id;
	Member.find({ "group_id": id, accepted: true }, (error, members) => {
		if (error) {
			res.status(400).send("Something went wrong");
		}
		if (members.length > 0) {
			const memberIds = [];
			members.forEach(member => memberIds.push(member.user_id));
			Parent.find({ parent_id: { $in: memberIds } }, (error, parents) => {
				if (error) res.status(400).send("Something went wrong");
				if (parents.length > 0) {
					const kidIds = [];
					parents.forEach(parent => {
						if (kidIds.indexOf(parent.child_id) === -1) {
							kidIds.push(parent.child_id);
						}
					})
					res.json(kidIds);
				} else {
					res.status(404).send("Group has no kids")
				}
			});

		} else {
			res.status(404).send("Group has no members")
		}
	})
});

router.get("/:id/notifications", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const id = req.params.id
	Notification.find({ owner_type: "group", owner_id: id }, (error, notifications) => {
		if (error) {
			res.status(400).send("Something went wrong");
		}
		if (notifications) {
			res.json(notifications);
		} else {
			res.status(400).send("Group has no notifications");
		}
	})
});

router.get("/:groupId/notifications/:notificationId", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const notificationId = req.params.notificationId;
	Notification.findOne({ notification_id: notificationId }, (error, notification) => {
		if (error) {
			res.status(400).send("Something went wrong");
		}
		if (notification) {
			res.json(notification);
		} else {
			res.status(400).send("Something went wrong");
		}
	})
});

router.get("/:id/events", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.id;
	Group.findOne({ group_id: group_id }, (error, group) => {
		if (error) res.status(400).send("Something went wrong")
		calendar.events.list({ calendarId: group.calendar_id }, (err, resp) => {
			if (err) res.status(400).send("Something went wrong");
			const events = resp.data.items.filter(event => event.extendedProperties.shared.status === "fixed")
			res.json(events)
		})
	});
})

router.post("/:id/agenda/export", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.id;
	Group.findOne({ group_id: group_id }, (error, group) => {
		Activity.find({ group_id: group_id }, (er, activities) => {
			if (error) res.status(400).send("Something went wrong")
			calendar.events.list({ calendarId: group.calendar_id }, async (err, resp) => {
				if (err) res.status(400).send("Something went wrong");
				const events = resp.data.items;
				for (const event of events) {
					const parentIds = JSON.parse(event.extendedProperties.shared.parents);
					const childIds = JSON.parse(event.extendedProperties.shared.children);
					const parents = await Profile.find({ user_id: { $in: parentIds } });
					const children = await Child.find({ child_id: { $in: childIds } });
					event.extendedProperties.shared.parents = JSON.stringify(parents.map(parent => `${parent.given_name} ${parent.family_name}`));
					event.extendedProperties.shared.children = JSON.stringify(children.map(child => `${child.given_name} ${child.family_name}`));
				}
				groupAgenda.createExcel(group, activities, events, function () {
					const mailOptions = {
						from: process.env.SERVER_MAIL,
						to: req.email,
						subject: `${group.name} group agenda`,
						html: groupAgenda.newGroupAgendaEmail(group.name),
						attachments: [
							{
								filename: `${group.name.toUpperCase()}.xlsx`,
								path: path.join(__dirname, `../../${group.name}.xlsx`)
							}
						]
					};
					transporter.sendMail(mailOptions, function (err, info) {
						fr('../', { files: `${group.name}.xlsx` })
					});
					res.status(200).send("Group Agenda sent")
				})
			})
		})
	})
});

router.post("/:id/activities", async (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	try {
	const { information, dates, timeslots } = req.body;
	const activity_id = objectid();
	const activity = {
		group_id: req.params.id,
		activity_id: activity_id,
		creator_id: req.user_id,
		name: information.name,
		color: information.color,
		description: information.description,
		repetition: dates.repetition,
		repetition_type: dates.repetitionType,
		different_timeslots: timeslots.differentTimeslots
	};
	const days = dates.selectedDays.map(day => {
		return {
			day_id: objectid(),
			activity_id: activity_id,
			date: day
		}
	})
	const group = await Group.findOne({ group_id: req.params.id })
	const events = [];
	activity.group_name = group.name;
	days.forEach((day, index) => {
		const dstart = moment(day.date);
		const dend = moment(day.date);
		timeslots.activityTimeslots[index].forEach(timeslot => {
			let startTime = timeslot.startTime;
			let endTime = timeslot.endTime;
			dstart.hours(startTime.substr(0, startTime.indexOf(":")))
			dstart.minutes(startTime.substr(startTime.indexOf(":") + 1, startTime.length - 1))
			dend.hours(endTime.substr(0, endTime.indexOf(":")))
			dend.minutes(endTime.substr(endTime.indexOf(":") + 1, endTime.length - 1))
			if( startTime.substr(0,startTime.indexOf(':')) > endTime.substr(0,endTime.indexOf(':'))){
				dend.add(1,'d')
			}
			const event = {
				description: timeslot.description,
				location: timeslot.location,
				summary: timeslot.name,
				start: {
					dateTime: dstart.toISOString(),
					date: null,
					timezone: 'Europe/Athens'
				},
				end: {
					dateTime: dend.toISOString(),
					date: null,
					timezone: 'Europe/Athens'
				},
				extendedProperties: {
					shared: {
						requiredParents: timeslot.requiredParents,
						requiredChildren: timeslot.requiredChildren,
						cost: timeslot.cost,
						activityId: activity_id,
						parents: JSON.stringify([]),
						children: JSON.stringify([]),
						status: "proposed",
						activityColor: information.color,
						groupId: req.params.id,
						repetition: dates.repetition ? dates.repetitionType : "none"
					}
				}
			}
			events.push(event)
		})
	})
	Promise.all( events.map( (event)=>  insertGroupEvent(event, group.calendar_id))).then( (responses)=> {
		Activity.create(activity);
		Day.create(days);
		res.status(200).send("Activity was created");
	}).catch( err => {
		console.log(err)
		res.status(500).send("Something went wrong");
	})
	} catch (error) {
		console.log(error)
		res.status(500).send("Something went wrong");
	}
});

router.get("/:id/activities", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.id
	Activity.find({ group_id: group_id })
		.populate('dates')
		.sort({'createdAt':-1})
		.lean().exec((error, activities) => {
			if (error) res.status(400).send("Something went wrong")
			res.json(activities);
		})
});

router.patch("/:id/activities/:activityId", (req, res) => {
	const activity_id = req.params.activityId;
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const activityPatch = req.body
	Activity.updateOne({ activity_id: activity_id }, activityPatch, (error) => {
		if (error) res.status(400).send("Something went wrong")
		res.status(200).send("Activity was updated");
	})
});

router.delete("/:groupId/activities/:activityId", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.groupId;
		Group.findOne({ group_id: group_id}, (error, group)=>{
			const activity_id = req.params.activityId
			calendar.events.list({ calendarId: group.calendar_id }, async (err,resp)=>{
				if(err){
					console.log(err)
					res.status(400).send("Something went wrong")
				}
			  try{
					const activityTimeslots = resp.data.items.filter( event => event.extendedProperties.shared.activityId===activity_id)
					await Promise.all( activityTimeslots.map( (event) => calendar.events.delete({ eventId: event.id, calendarId: group.calendar_id })))
					await Activity.deleteOne({ activity_id: activity_id })
					await Day.deleteMany({ activity_id: activity_id })
					res.status(200).send("Activity Deleted");
				} catch (error) {
					console.log(error)
					res.status(400).send("Something went wrong")
				}
		})
	})
});

router.get("/:groupId/activities/:activityId", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const activityId = req.params.activityId;
	Activity.findOne({ activity_id: activityId })
		.populate('dates')
		.lean().exec((error, activity) => {
			if (error) res.status(400).send("Something went wrong")
			res.json(activity);
		})

})

router.post("/:groupId/activities/:activityId/export", (req,res)=> {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.groupId;
	const activity_id = req.params.activityId;
	Group.findOne({ group_id: group_id }, (error, group) => {
		if (error) res.status(400).send("Something went wrong")
		calendar.events.list({ calendarId: group.calendar_id }, async (err, resp) => {
			if (err) {
				console.log(err)
				res.status(400).send("Something went wrong")
			}
			const activity = await Activity.findOne({ activity_id : activity_id });
			const calendarEvents = resp.data.items;
			const activityTimeslots = calendarEvents.filter(event => event.extendedProperties.shared.activityId === activity_id);
			exportActivity.createPdf(activity,activityTimeslots, function () {
        const mailOptions = {
            from: process.env.SERVER_MAIL,
            to: req.email,
            subject: `Activity: ${activity.name} `,
            html: exportActivity.newExportEmail(activity.name),
            attachments: [
                {
                    filename: `${activity.name.toUpperCase()}.pdf`,
                    path: path.join(__dirname, `../../${activity.name.toUpperCase()}.pdf`)
                }
            ]
        };
        transporter.sendMail(mailOptions, function (err, info) {
						fr('../', { files:  `${activity.name.toUpperCase()}.pdf`})
				});
				res.status(200).send("Exported activity successfully")
    })
		})
	})
})

router.get("/:groupId/activities/:activityId/timeslots", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.groupId;
	const activity_id = req.params.activityId;
	Group.findOne({ group_id: group_id }, (error, group) => {
		if (error) res.status(400).send("Something went wrong")
		calendar.events.list({ calendarId: group.calendar_id }, (err, resp) => {
			if (err) {
				console.log(err)
				res.status(400).send("Something went wrong")
			}
			const calendarEvents = resp.data.items;
			const activityTimeslots = calendarEvents.filter(event => event.extendedProperties.shared.activityId === activity_id);
			res.json(activityTimeslots);
		});
	});
});

router.post("/:id/activities/:activityId/export", (req, res) => {
	
});

router.patch("/:groupId/activities/:activityId/timeslots/:timeslotId", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.groupId;
	const timeslotPatch = {
		summary: req.body.summary,
		description: req.body.description,
		location: req.body.location,
		start: req.body.start,
		end: req.body.end,
		extendedProperties: req.body.extendedProperties
	}
	Group.findOne({ group_id: group_id }, (error, group) => {
		if (error) res.status(400).send("Something went wrong")
		calendar.events.patch({ calendarId: group.calendar_id, eventId: req.body.id, resource: timeslotPatch }, (err, response) => {
			if (err) {
				console.log(err)
				res.status(400).send("Something went wrong")
			}
			res.status(200).send("Timeslot was updated")
		})
	})
});

router.get("/:id/announcements", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const id = req.params.id;
	Announcement.find({ group_id: id })
		.populate('images')
		.sort({createdAt: -1})
		.lean().exec((error, announcements) => {
			if (error) {
				res.status(400).send("Something went wrong");
			}
			if (announcements) {
				res.json(announcements);
			} else {
				res.status(400).send("No announcements found")
			}
		});
});

router.post("/:id/announcements", announcementUpload.array('photo', 5), async (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const group_id = req.params.id;
	const user_id = req.body.user_id;
	const announcement_id = objectid();
	const files = req.files;
	const announcement = {
		announcement_id: announcement_id,
		user_id: user_id,
		group_id: group_id,
		body: req.body.message,
	};
	try {
		if (files.length > 0) {
			const images = [];
			files.forEach(photo => {
				images.push({
					image_id: objectid(),
					owner_type: "announcement",
					owner_id: announcement_id,
					path: "/images/announcements/" + photo.filename
				});
			});
			await Image.create(images)
		}
		await Announcement.create(announcement);
		res.status(200).send("Announcement was posted");
	} catch (err) {
		res.status(400).send("Something went wrong")
	}
});

router.delete("/:groupId/announcements/:announcementId", async (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const announcement_id = req.params.announcementId
	try {
		await Announcement.deleteOne({ announcement_id: announcement_id });
		await Image.deleteMany({ owner_type: "announcement", owner_id: announcement_id });
		await Reply.deleteMany({ announcement_id: announcement_id });
		await fr(`../images/announcements/`, { prefix: req.params.announcementId })
		res.status(200).send("announcement was deleted");
	} catch (error) {
		res.status(400).send("Something went wrong");
	}
});

router.post("/:groupId/announcements/:announcementId/replies", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const announcement_id = req.params.announcementId;
	const reply = {
		announcement_id: announcement_id,
		body: req.body.message,
		user_id: req.body.user_id
	};
	Reply.create(reply, (error, reply) => {
		if (error) res.status(400).send("Something went wrong");
		res.status(200).send("reply was posted")
	})
});

router.get("/:groupId/announcements/:announcementId/replies", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const announcement_id = req.params.announcementId;
	Reply.find({ announcement_id: announcement_id }, (error, replies) => {
		if (error) {
			res.status(400).send("Something went wrong");
		}
		if (replies) {
			res.json(replies)
		} else {
			res.status(400).send("announcement has no replies")
		}
	});
});

router.delete("/:groupId/announcements/:announcementId/replies/:replyId", (req, res) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	const reply_id = req.params.replyId;
	Reply.deleteOne({ reply_id: reply_id }, (err) => {
		if (err) res.status(400).send("Something went wrong");
		res.status(200).send("reply was deleted");
	});
});


Group.find({},(err, groups)=>{
	groups.forEach( group => {
		group.background = "#afdddd"
		group.save()
	})
})

module.exports = router;

