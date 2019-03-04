const express = require('express');
const router = new express.Router();
const objectid = require('objectid');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fr = require('find-remove');
const nodemailer = require('nodemailer');
const nh = require('../helper-functions/notification-helpers');
const uh = require('../helper-functions/user-helpers');
const hf = require('../helper-functions/forgot-password-email');
const wt = require('../helper-functions/walthrough-email');
const exportData = require('../helper-functions/export-user-data.js');
const path = require('path')
const texts = require('../constants/notification-texts')
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/calendar';
const googleToken = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes)
const calendar = google.calendar({ 
	version: 'v3',
	auth: googleToken,
});
const fbadmin = require('firebase-admin');
if (!fbadmin.apps.length) {
	fbadmin.initializeApp({
		credential: fbadmin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
		}),
		databaseURL: process.env.FIREBASE_DATABASE_NAME,
	});
}
const sharp = require('sharp');

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

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../images/profiles'))
    },
    filename: function (req, file, cb) {
        fr(path.join(__dirname, '../../images/profiles'),{prefix: req.params.id})
        cb(null, req.params.id + '-' + Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf("/") + 1, file.mimetype.length))
    }
});
const profileUpload = multer({ storage: profileStorage });

const childProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../images/profiles'))
    },
    filename: function (req, file, cb) {
        fr(path.join(__dirname, '../../images/profiles'),{prefix: req.params.childId})
        cb(null, req.params.childId + '-' + Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf("/") + 1, file.mimetype.length))
    }
});
const childProfileUpload = multer({ storage: childProfileStorage});

const Profile = require('../models/profile');
const Address = require('../models/address');
const Group = require('../models/group');
const Image = require('../models/image');
const Member = require('../models/member');
const User = require('../models/user');
const Notification = require('../models/notification');
const Parent = require('../models/parent');
const Reply = require('../models/reply')
const Child = require('../models/child');
const Announcement = require('../models/announcement');
const Framily = require('../models/framily');
const Password_Reset = require('../models/password-reset');
const Device = require('../models/device');
const Rating = require('../models/rating');



router.post('/', async (req, res, next) => {
	const { given_name, family_name, number, email, password, visible, language, deviceToken } = req.body;
	if (given_name && family_name && email && password && visible !== undefined && language) {
		try {
			const user = await User.findOne({ email: email });
			if (user) {
				res.status(409).send("User already exists")
			} else {
				const user_id = objectid();
				const address_id = objectid();
				const image_id = objectid();
				const token = jwt.sign({ user_id: user_id }, process.env.SERVER_SECRET);
				const user = {
					user_id,
					provider: "families_share",
					email,
					token,
					password,
					language,
					last_login: new Date(),
				};
				const profile = {
					given_name,
					family_name,
					user_id,
					email,
					phone: number,
					phone_type: "unspecified",
					visible,
					image_id,
					address_id,
				};
				const image = {
					image_id,
					owner_type: "user",
					owner_id: user_id,
					path: "/images/profiles/user_default_photo.png",
					thumbnail_path: "/images/profiles/user_default_photo.png",
				};
				const address = {
					address_id,
					street: "",
					number: "",
					city: ""
				};
				const rating = {
					user_id,
					rating: 0
				};
				if (deviceToken!==undefined && deviceToken !== null) {
					const device = await Device.findOne({ device_id: deviceToken });
					if (device) {
						device.user_id = user_id ; 
						device.save();
					} else {
						await Device.create({
							user_id,
							device_id: deviceToken
						});
					}
				}
				await User.create(user);
				await Profile.create(profile);
				await Image.create(image);
				await Address.create(address);
				await Rating.create(rating);
				const response = {
					id: user_id,
					email: email,
					name: `${given_name} ${family_name}`,
					image: "/images/profiles/user_default_photo.png",
					token: token,
				};
				res.json(response);
			}
		} catch (err) {
			next(err)
		}
	} else {
		res.status(400).send("Incorrect parameters");
	}
});

router.post("/authenticate/email", async (req, res, next) => {
	const { email, password, deviceToken, language } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const passwordMatch = await user.comparePassword(password);
			if(passwordMatch){
			if (deviceToken!==undefined && deviceToken !== null) {
			const device = await Device.findOne({ device_id: deviceToken });
				if (device) {
					device.user_id = user.user_id;
					device.save();
				} else {
					await Device.create({
						user_id: user.user_id,
						device_id: deviceToken
					});
				}
			}
			const profile = await Profile.findOne({ user_id: user.user_id })
				.populate("image")
				.lean()
				.exec();
			const token = jwt.sign(
				{ user_id: user.user_id, email: email },
				process.env.SERVER_SECRET
			);
			const response = {
				id: user.user_id,
				email,
				name: `${profile.given_name} ${profile.family_name}`,
				image: profile.image.path,
				token
			};
			user.last_login = new Date();
			user.language = language;
			user.save();
			res.json(response);
		} else {
			res.status(401).send("Authentication failure");
		}
		} else {
		  res.status(401).send("Authentication failure");
		}
	} catch (error) {
		console.log(error)
		next(error);
	}
});

router.post('/authenticate/google', async (req, res, next) => {
	const { deviceToken, language, origin } = req.body;
	let googleProfile, googleToken;
	if (origin === 'native') {
		googleProfile = req.body.response.user
		googleToken = req.body.response.idToken
	} else {
		googleProfile = req.body.response.profileObj
		googleToken = req.body.response.tokenObj.id_token
	}
	try {
		const user = await User.findOne({ email: googleProfile.email })
		if (user) {
			if (deviceToken!==undefined && deviceToken !== null) {
				const device = await Device.findOne({ device_id: deviceToken })
				if (device) {
					device.user_id = user.user_id ; 
					await device.save();
				} else {
					await Device.create({
						user_id: user.user_id,
						device_id: deviceToken
					});
				}
			}
			const profile = await Profile.findOne({ user_id: user.user_id }).populate('image').lean().exec()
			const token = jwt.sign({ user_id: user.user_id, email: googleProfile.email }, process.env.SERVER_SECRET);
			const response = {
				id: profile.user_id,
				email: profile.email,
				name: `${profile.given_name} ${profile.family_name}`,
				image: profile.image.path,
				token,
				google_token: googleToken,
				origin: req.body.origin,
			};
			user.last_login = new Date();
			user.language = language;
			user.save();
			res.json(response);
		} else {
			const user_id = objectid();
			if (deviceToken!==undefined && deviceToken !== null) {
				const device = await Device.findOne({ device_id: deviceToken })
				if (device) {
					device.user_id = user_id ; 
					await device.save();
				} else {
					await Device.create({
						user_id,
						device_id: deviceToken
					});
				}
			}
			const address_id = objectid();
			const image_id = objectid();
			const token = jwt.sign({ user_id: user_id, email: googleProfile.email }, process.env.SERVER_SECRET);
			const user = {
				user_id: user_id,
				provider: "google",
				email: googleProfile.email,
				token,
				auth0_token: googleToken,
				language,
				last_login: new Date(),
			};
			const profile = {
				given_name: googleProfile.givenName,
				family_name: googleProfile.familyName,
				user_id: user_id,
				email: googleProfile.email,
				phone: "",
				phone_type: "mobile",
				visible: true,
				image_id: image_id,
				address_id: address_id,
			};
			const image = {
				image_id: image_id,
				owner_type: "user",
				owner_id: user_id,
				path: req.body.origin === 'native' ? googleProfile.photo : googleProfile.imageUrl,
				thumbnail_path: req.body.origin === 'native' ? googleProfile.photo : googleProfile.imageUrl,
			};
			const address = {
				address_id: address_id,
				street: "",
				number: "",
				city: ""
			};
			const rating = {
				user_id,
				rating: 0,
			}
			await User.create(user);
			await Profile.create(profile);
			await Image.create(image);
			await Address.create(address);
			await Rating.create(rating);
			res.json({
				id: user_id,
				token,
				google_token: googleToken,
				origin: req.body.origin,
				email: googleProfile.email,
				name: `${googleProfile.givenName} ${googleProfile.familyName}`,
				image: req.body.origin === 'native' ? googleProfile.photo : googleProfile.imageUrl,
			});
		}
	} catch (err) {
		next(err)
	}
});

router.get("/changepasswordredirect/:token", (req, res)=>{
  res.redirect(`families-share://changepsw/${req.params.token}`)
})

router.post('/forgotpassword', (req, res, next) => {
    const email = req.body.email;
    User.findOne({ email: email }, (error, user) => {
        if(error) next(error);
        if(user){
            const token = jwt.sign({ user_id: user.user_id, email: email }, process.env.SERVER_SECRET, { expiresIn: 60*60*24 });
					const mailOptions = {
						from: process.env.SERVER_MAIL,
						to: email,
						subject: 'Forgot Password',
						html: hf.newForgotPasswordEmail(token)
					};
					transporter.sendMail(mailOptions, function (err, info) {
						if (err) next(err)
						Password_Reset.findOne({ user_id: user.user_id, email: email }, (er, reset) => {
							if (er) res.status(400).send("Something went wrong");
							if (reset) {
								reset.token = token;
								reset.save();
							} else {
								Password_Reset.create({
									user_id: user.user_id,
									email: user.email,
									token: token,
								})
							}
						})
						res.status(200).send("Forgot password email was sent");

					});
				} else {
					res.status(404).send("User doesn't exist");
				}
    });
});

router.get('/changepassword', async (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Invalid token');
	try {
		const user_id = req.user_id
		const reset = await Password_Reset.findOne({ user_id: user_id })
		if (reset) {
			const profile = await Profile.findOne({ user_id: user_id }).populate('image').lean().exec()
			res.json(profile);
		} else {
			res.status(404).send("Bad Request")
		}
	} catch (error) {
		next(error)
	}
});

router.post('/changepassword', async (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authorized')
	try {
		const { user_id, email } = req;
		const reset = await Password_Reset.findOneAndDelete({ user_id: user_id });
		if (reset) {
			const profile = await Profile.findOne({ user_id: user_id }).populate('image').exec()
			const user = await User.findOne({ user_id: user_id })
			const token = await jwt.sign({ user_id, email }, process.env.SERVER_SECRET);
			const response = {
				id: user_id,
				email,
				name: `${profile.given_name} ${profile.family_name}`,
				image: profile.image.path,
				token,
			};
			user.last_login = new Date();
			user.password = req.body.password;
			user.save();
			res.json(response)
		} else {
			res.status(404).send("Reset not found")
		}
	} catch (error) {
		next(error);
	}
});

router.get('/:id', (req, res, next) =>{
		if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
    const id = req.params.id;
    User.findOne( { user_id : id }, (error, user) => {
        if(error) next(error);
        if(user){
            res.json(user);
        } else {
            res.status(404).send("User doesn't exist");
        }
    });
});

router.delete('/:id', async(req, res, next)=>{
		if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
    const userId = req.params.id;
    try {
        await User.deleteOne({ user_id: userId })
        await Password_Reset.deleteOne({ user_id: userId })
        const profile = await Profile.findOne({ user_id: userId })
        await Address.deleteOne({ address_id: profile.address_id})
        await Image.deleteOne({ image_id: profile.image_id})
        await Profile.deleteOne({user_id: userId})
        const childDeleteIds = [];
        const parents = await Parent.find({});
        const usersChildren = parents.filter( parent => parent.parent_id === userId);
        usersChildren.forEach( child => {
            if(parents.filter(parent => parent.child_id === child.child_id).length===1) {
                childDeleteIds.push(child.child_id)
            }
        })
        await Parent.deleteMany({ parent_id: userId})
        if(childDeleteIds.length>0){
            for (const childId of childDeleteIds){ 
                const child = await Child.findOne({child_id: childId})
                await Image.deleteOne({image_id: child.image_id})
                await Child.deleteOne({ child_id: childId}, (err))
            }
        }
        await Framily.deleteMany({ user_id: userId})
        await Framily.deleteMany({ framily_id: userId})
        const announcements = await Announcement.find({ user_id: userId})
        for (const announcement of announcements){ 
            await Image.deleteMany({ owner_id: announcement.announcement_id})
        }
        await Announcement.deleteMany({ user_id: userId})
        await Reply.deleteMany({ user_id: userId})
        const userMemberships = await Member.find({ user_id: userId })
        const groupIds = [];
        userMemberships.forEach( membership => {if(membership.user_accepted && membership.group_accepted) groupIds.push(membership.group_id)})
        const groups = await Group.find({ group_id: {$in: groupIds }})
        for( const group of groups){
            await calendar.events.list({calendarId: group.calendar_id},(err,response)=>{
                const groupEvents = response.data.items
                for( const event of groupEvents){
                    const parentParticipants = JSON.parse(event.extendedProperties.shared.parents)
                    const childParticipants = JSON.parse(event.extendedProperties.shared.children)
                    const filteredChildren = JSON.parse(event.extendedProperties.shared.children);
                    const filteredParents = parentParticipants.filter( id => id !== userId)
                    if( childDeleteIds.length>0){
                        childDeleteIds.forEach( childId => {
                            filteredChildren.splice(filteredChildren.indexOf(childId),1)
                        })
                    }
                    if(filteredParents.length!==parentParticipants.length || filteredChildren.length !== childParticipants.length){
                        const timeslotPatch = {
                            extendedProperties: {
                                shared: {
                                    parents: JSON.stringify(filteredParents),
                                    children: JSON.stringify(filteredChildren)
                                }
                            }
                        }
                        calendar.events.patch({ calendarId: group.calendar_id, eventId: event.id, resource: timeslotPatch },(err)=>{
                            if(err) throw(err)
                            console.log("event edited")
                        });
                    }
                }
            })
        }
        await Member.deleteMany({ user_id: userId})
        res.status(200).send("account deleted")   
    } catch (error) {
        next(error)
    }
})

router.get('/:id/rating', (req, res, next)=>{
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	Rating.findOne({ user_id: req.params.id}, (err,rating)=>{
		if(err) next(err)
    res.json(rating)
	})
})

router.patch('/:id/rating', (req, res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	if (req.body.rating) {
		Rating.updateOne({ user_id: req.params.id }, { rating: req.body.rating }, (err, raw) => {
			if (err) next(err)
			res.status(200).send("Rating updated")
		})
	} else {
		res.status(400).send("Something went wrong")
	}
});

router.get('/:id/groups', (req, res, next) => {
  	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
    const id = req.params.id
    Member.find( { user_id: id  }, ( error, groups ) => {
        if (error) next(error)
        if (groups.length>0) {
            res.json(groups);
        } else {
            res.status(404).send("User hasn't joined any groups")
        }
    })
});

router.post('/:id/walkthrough', async (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Not authenticated')
	try {
		const user = await User.findOne({ user_id: req.user_id })
		const profile = await Profile.findOne({ user_id: req.user_id })
		if (user && profile) {
			const mailOptions = {
				from: process.env.SERVER_MAIL,
				to: user.email,
				subject: 'Platform walkthrough',
				html: wt.newWalkthroughEmail(profile.given_name),
				attachments: [
					{
						filename: `Families_Share_Walkthrough.pdf`,
						path: path.join(__dirname, `../../Families_Share_Walkthrough.pdf`)
					}

				]
			};
			transporter.sendMail(mailOptions, function (err, info) {
				if (err) next(err)
				res.status(200).send("Walkthrough was sent successfully")
			});
		} else {
			res.status(404).send("User not found")
		}
	} catch (error) {
		next(error)
	}
});

router.post("/:id/groups", (req, res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	const member = req.body;
	if (member.user_id && member.group_id && member.group_accepted !== undefined && member.user_accepted !== undefined) {
		Member.create(member, (error, member) => {
			if (error) next(error)
			res.status(200).send("joined succesfully");
		})
	} else {
		res.status(400).send("Something went wrong")
	}
});

router.patch('/:userId/groups/:groupId', (req, res, next) => {
	if (req.user_id !== req.params.userId) return res.status(401).send('Unauthorized');
	const group_id = req.params.groupId;
	const user_id = req.params.userId;
	const patch = req.body.patch;
	if (user_id && group_id && patch.user_accepted !== undefined) {
		Member.updateOne({ user_id: user_id, group_id: group_id }, patch, async (err, raw) => {
			if (err) next(err)
			await nh.newMemberNotification(group_id, user_id);
			res.status(200).send("User joined")
		});
	} else {
		res.status(400).send("Something went wrong")
	}
});

router.delete('/:userId/groups/:groupId', async (req, res, next) => {
	if (req.user_id !== req.params.userId) return res.status(401).send('Unauthorized')
	try {
		const user_id = req.params.userId;
		const group_id = req.params.groupId;
		const children = await Parent.find({ parent_id: user_id });
		const usersChildrenIds = children.map(child => child.child_id)
		const group = await Group.findOne({ group_id: group_id });
		await calendar.events.list({ calendarId: group.calendar_id }, async (err, resp) => {
			try {
				const events = resp.data.items.filter(event => event.extendedProperties.shared.status !== "completed")
				events.forEach(event => {
					const parentIds = JSON.parse(event.extendedProperties.shared.parents);
					event.extendedProperties.shared.parents = JSON.stringify(parentIds.filter(id => id !== user_id))
					const childrenIds = JSON.parse(event.extendedProperties.shared.children);
					event.extendedProperties.shared.children = JSON.stringify(childrenIds.filter(id => usersChildrenIds.indexOf(id) === -1))
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
				res.status(200).send("User left group")
			} catch (error) {
				res.status(500).send("Something went wrong")
			}
		})
	} catch (error) {
		res.status(500).send("Something went wrong")
	}
});

router.post('/:id/export', async (req, res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	const id = req.params.id;
	try {
		const profile = await Profile.findOne({ user_id: id }).populate('address').populate('image').lean().exec();
		const usersGroups = await Member.find({ user_id: id, user_accepted: true, group_accepted: true })
		let groups = [];
		if (usersGroups.length > 0) {
			groups = await Group.find({ group_id: { $in: usersGroups.map(group => group.group_id) } })
		}
		const usersChildren = await Parent.find({ parent_id: id });
		let children = [];
		const childIds = usersChildren.map(child => child.child_id)
		if (usersChildren.length > 0) {
			children = await Child.find({ child_id: { $in: childIds } }).populate('image').lean().exec();
		}
		const responses = await Promise.all(groups.map(group => uh.getUsersGroupEvents(group.calendar_id, id, childIds)))
		const events = [].concat(...responses)
		exportData.createPdf(profile, groups, children, events, function () {
			const mailOptions = {
				from: process.env.SERVER_MAIL,
				to: req.email,
				subject: `${profile.given_name} ${profile.family_name} Families Share Data`,
				html: exportData.newExportEmail(profile.given_name),
				attachments: [
					{
						filename: `${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf`,
						path: path.join(__dirname, `../../${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf`)
					}
				]
			};
			transporter.sendMail(mailOptions, function (err, info) {
				fr('../', { files: `${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf` })
			});
			res.status(200).send("Exported data successfully")
		})
	} catch (error) {
		next(error);
	}
});

router.get('/:id/events', async (req,res)=>{
	  if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
    try{
        const user_id = req.params.id;
        const usersGroups = await Member.find({ user_id: user_id, user_accepted: true, group_accepted: true })
        const groupIds = usersGroups.map( group => group.group_id);
				const groups = await Group.find( {group_id: { $in: groupIds}});
				const children = await Parent.find({parent_id: user_id })
				const childIds = children.map( parent => parent.child_id);
        const responses = await Promise.all( groups.map( group => uh.getUsersGroupEvents(group.calendar_id,user_id,childIds)))
				const events = [].concat( ... responses )
        res.status(200).json(events)
    } catch ( error) {
        console.log(error)
        res.status(400).send("Something went wrong")
    }       
})

router.get('/:id/profile', (req, res, next)=>{
	  if (!req.user_id ) return res.status(401).send('Unauthorized')
    const id = req.params.id;
    Profile.findOne({ user_id: id })
    .populate('image')
    .populate('address')
    .lean().exec( (error, profile) =>{
        if (error) next(error);
        if(profile){
            res.json(profile);
        } else {
            res.status(404).send("Profile not found")
        }
    });
});

router.patch('/:id/profile', profileUpload.single('photo'), async (req, res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	const user_id = req.params.id;
	const file = req.file;
	const { given_name, family_name, email, phone, phone_type, visible, street, number, city } = req.body
	if (given_name || family_name || email || phone || phone_type || visible || street || number || city) {
		const profilePatch = {
			given_name,
			family_name,
			email,
			phone,
			phone_type,
			visible,
		};
		const addressPatch = {
			street,
			number,
			city,
		}
		try {
			await Address.updateOne({ address_id: req.body.address_id }, addressPatch)
			await Profile.updateOne({ user_id: user_id }, profilePatch);
			if (file) {
				const fileName = file.filename.split('.')
				const imagePatch = {
					path: `/images/profiles/${file.filename}`,
					thumbnail_path: `/images/profiles/${fileName[0]}_t.${fileName[1]}`,
				};
				await sharp(path.join(__dirname, `../../images/profiles/${file.filename}`))
					.resize({
						height: 200,
						fit: sharp.fit.cover,
					})
					.toFile(path.join(__dirname, `../../images/profiles/${fileName[0]}_t.${fileName[1]}`), async (err) => {
						if (err) res.status(400).send(err);
						await Image.updateOne({ owner_type: "user", owner_id: user_id }, imagePatch);
						res.status(200).send("Profile Updated");
					})
			} else {
				res.status(200).send("Profile Updated");
			}
		} catch (err) {
			next(error);
		}
	}
	else {
		res.status(400).send("Something went wrong")
	}
});

router.get('/:id/notifications', async (req, res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	const id = req.params.id
	try {
		const user = await User.findOne({ user_id: id })
		const notifications = await Notification.find({ owner_type: "user", owner_id: id }).sort({ 'createdAt': -1 }).lean().exec()
		if (notifications.length > 0) {
			for (const notification of notifications) {
				notification.header = texts[user.language][notification.type][notification.code].header;
				notification.description = await uh.getNotificationDescription(notification, user.language);
			}
			return res.json(notifications);
		} else {
			res.status(404).send("User has no notifications")
		}
	} catch (error) {
		next(error)
	}
});

router.patch('/:id/notifications', (req,res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	const id = req.params.id
	Notification.updateMany( { owner_type: "user", owner_id: id, read: false},{ read: true }, ( error, raw ) => {
			if (error) next(error)
			res.status(200).send("Notifications updated")
	})
});

router.get('/:id/framily', (req, res) => {
	// if (!req.user_id ) return res.status(401).send('Unauthorized')
	// const id = req.params.id
	// Framily.find( {user_id: id} , (error, framily) => {
	//     if (error) {
	//         res.status(400).send("Something went wrong")
	//     }
	//     if (framily.length>0) {
	//         return res.json(framily);
	//     } else {
	//         res.status(404).send("User has no framily members");
	//     }
	// })
});

router.post('/:id/framily', (req, res) => {
	// if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	// const user_id = req.params.id;
	// const inviteIds = req.body.inviteIds;
	// const framilyMembers = [];
	// Framily.find({ user_id: user_id }, (error, members) => {
	//     if (error) res.status(400).send("Something went wrong");
	//     inviteIds.forEach(inviteId => {
	//         if (members.filter(member => member.framily_id === inviteId).length === 0) {
	//             framilyMembers.push({
	//                 framily_id: inviteId,
	//                 user_id: user_id
	//             })
	//             framilyMembers.push({
	//                 framily_id: user_id,
	//                 user_id: inviteId,
	//             })
							
	//         }
	//     })
	//     Framily.create(framilyMembers)
	//     res.status(200).send("Framily members added")
	// })
});

router.get('/:id/children', (req, res, next) => {
  	if (!req.user_id ) return res.status(401).send('Unauthorized')
    const id = req.params.id
    Parent.find( { parent_id: id }, ( error, children ) => {
        if (error) next(error)
        if (children.length>0) {
            return res.json(children);
        } else {
            res.status(404).send("User has no children");
        }
    })
});

router.post('/:id/children', async (req, res, next) => {
	if (req.user_id !== req.params.id) return res.status(401).send('Unauthorized')
	const { birthdate, given_name, family_name, gender, allergies, other_info, special_needs } = req.body;
	if (birthdate && given_name && family_name && gender) {
		const parent_id = req.params.id;
		const child = {
				birthdate,
				given_name,
				family_name,
				gender,
				allergies,
				other_info,
				special_needs,
		};
		const image_id = objectid();
		const child_id = objectid();
		const image = {
			image_id,
			owner_type: "child",
			owner_id: child_id,
			path: "/images/profiles/child_default_photo.jpg",
		};
		child.child_id = child_id;
		child.background = "#00838F";
		child.image_id = image_id;
		const parent = {
			parent_id,
			child_id,
		}
		try {
			await Image.create(image);
			await Child.create(child);
			await Parent.create(parent);
			res.status(200).send("Child created");
		} catch (error) {
			next(error)
		}
	}
	else {
		res.status(400).send("Something went wrong")
	}
});

router.get("/:userId/children/:childId", (req, res, next) => {
		if (!req.user_id ) return res.status(401).send('Unauthorized')
    Child.findOne({ child_id: req.params.childId})
    .populate('image')
    .lean().exec( (error, child) =>{
        if(error) next(error);
        if(child){
            res.json(child);
        } else {
            res.status(404).send("No child found");
        }
    });
});

router.patch("/:userId/children/:childId", childProfileUpload.single('photo'), async (req, res, next) => {
	if (req.user_id !== req.params.userId) return res.status(401).send('Unauthorized')
	const file = req.file;
	const child_id = req.params.childId;
	const { given_name, family_name, gender, birthdate, background, allergies, other_info, special_needs} = req.body;
	const childPatch = {
		given_name,
		family_name,
		gender,
		birthdate,
		background,
		allergies,
		other_info,
		special_needs,
	};
	if (given_name || family_name || gender || birthdate || background || allergies || other_info || special_needs) {
		try {
			await Child.updateOne({ child_id: child_id }, childPatch)
			if (file) {
				const fileName = file.filename.split('.')
				const imagePatch = {
					path: `/images/profiles/${file.filename}`,
					thumbnail_path: `/images/profiles/${fileName[0]}_t.${fileName[1]}`,
				};
				await sharp(path.join(__dirname, `../../images/profiles/${file.filename}`))
					.resize({
						height: 200,
						fit: sharp.fit.cover,
					})
					.toFile(path.join(__dirname, `../../images/profiles/${fileName[0]}_t.${fileName[1]}`));
				await Image.updateOne({ owner_type: "child", owner_id: child_id }, imagePatch);
			}
			res.status(200).send(" Child Profile Updated");
		} catch (error) {
			next(error)
		}
	} else {
		res.status(400).send("Something went wrong")
	}
});

router.delete("/:userId/children/:childId", async (req, res, next) => {
		if (req.user_id !== req.params.userId) return res.status(401).send('Unauthorized')
    const child_id = req.params.childId;
    try{
				const memberships = await Member.find({user_id: req.params.userId});
				const groupIds = memberships.map( membership => membership.group_id);
				const userGroups = await Group.find({group_id: {$in: groupIds}});
				await Promise.all(userGroups.map((group) => {uh.unsubcribeChildFromGroupEvents(group.calendar_id,child_id)}));
        await Child.deleteOne({ child_id: child_id});
        await Parent.deleteMany({ child_id: child_id });
        await Image.deleteOne({owner_type: "child", owner_id: child_id });
        res.status(200).send("Child deleted");
    } catch (error) {
        next(error);
    }
});

router.get("/:userId/children/:childId/parents", (req, res, next) => {
	if (!req.user_id) return res.status(401).send('Unauthorized')
	Parent.find({ child_id: req.params.childId }, (error, parents) => {
		if (error) next(error);
		if (parents.length > 0) {
			const parentIds = [];
			parents.forEach(parent => parentIds.push(parent.parent_id));
			Profile.find({ user_id: { $in: parentIds } }, (err, parentProfiles) => {
				if (err) next(err)
				res.json(parentProfiles)
			})
		} else {
			res.status(404).send("Child has no parents");
		}
	});
});

router.post("/:userId/children/:childId/parents", (req, res, next) => {
	if (req.user_id !== req.params.userId) return res.status(401).send('Unauthorized')
	const parentId = req.body.parentId
	Parent.find({ child_id: req.params.childId }, (error, parents) => {
		if (error) next(error);
		if (parents.length < 2 && parentId) {
			Parent.create({
				parent_id: parentId,
				child_id: req.params.childId,
			})
			res.status(200).send("Parent added");
		} else {
			res.status(400).send("Something went wrong");
		}
	});
});

router.delete("/:userId/children/:childId/parents/:parentId", (req, res, next) => {
	if (req.user_id !== req.params.userId) return res.status(401).send('Unauthorized')
	const parentId = req.params.parentId
	Parent.deleteOne({ child_id: req.params.childId, parent_id: parentId}, (error) =>{
			if(error) next(error);
			res.status(200).send("Parent deleted");
	});
});

module.exports = router;

const bcrypt = require('bcrypt');

router.post("/:userId/sendmenotification", (req, res) => {
	Device.find({ user_id: req.params.userId}, (err,devices)=>{
		if(devices){
			devices.forEach( device=>{
				const message = {
					notification:{title: "Welcome", body:"Families Share welcomes you to our community"},
					token: device.device_id
				}
				fbadmin.messaging().send(message)
				.then((response) => {
	                  console.log('Successfully sent message:', response);
				})
				.catch((error) => {
	                  if(error.code==='messaging/registration-token-not-registered'){
	                      Device.deleteOne({ user_id: req.params.id, device_id: device.device_id})
	                  }
				});
			})
		}
	  })
	  res.status(200).send("Push notification sent")
})

