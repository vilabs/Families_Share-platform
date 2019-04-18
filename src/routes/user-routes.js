const express = require('express')

const router = new express.Router()
const objectid = require('objectid')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fr = require('find-remove')
const nodemailer = require('nodemailer')
const path = require('path')
const nh = require('../helper-functions/notification-helpers')
const uh = require('../helper-functions/user-helpers');
const hf = require('../helper-functions/forgot-password-email')
const wt = require('../helper-functions/walthrough-email')
const exportData = require('../helper-functions/export-user-data.js')
const texts = require('../constants/notification-texts')
const { google } = require('googleapis')

const scopes = 'https://www.googleapis.com/auth/calendar'
const googleToken = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes)
const calendar = google.calendar({
  version: 'v3',
  auth: googleToken
})
const fbadmin = require('firebase-admin')

if (!fbadmin.apps.length) {
  fbadmin.initializeApp({
    credential: fbadmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_NAME
  })
}
const sharp = require('sharp')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SERVER_MAIL,
    pass: process.env.SERVER_MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

const profileStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../../images/profiles'))
  },
  filename (req, file, cb) {
    fr(path.join(__dirname, '../../images/profiles'), { prefix: req.params.id })
    cb(null, `${req.params.id}-${Date.now()}.${file.mimetype.slice(file.mimetype.indexOf('/') + 1, file.mimetype.length)}`)
  }
})
const profileUpload = multer({ storage: profileStorage, limits:  {fieldSize: 52428800 } })

const childProfileStorage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../../images/profiles'))
  },
  filename (req, file, cb) {
    fr(path.join(__dirname, '../../images/profiles'), { prefix: req.params.childId })
    cb(null, `${req.params.childId}-${Date.now()}.${file.mimetype.slice(file.mimetype.indexOf('/') + 1, file.mimetype.length)}`)
  }
})
const childProfileUpload = multer({ storage: childProfileStorage, limits:  {fieldSize: 52428800 } })

const Profile = require('../models/profile')
const Address = require('../models/address')
const Group = require('../models/group')
const Image = require('../models/image')
const Member = require('../models/member')
const User = require('../models/user')
const Notification = require('../models/notification')
const Parent = require('../models/parent')
const Reply = require('../models/reply')
const Child = require('../models/child')
const Announcement = require('../models/announcement')
// const Framily = require('../models/framily')
const Password_Reset = require('../models/password-reset')
const Device = require('../models/device')
const Rating = require('../models/rating')

router.post('/', async (req, res, next) => {
  const {
    given_name, family_name, number, email, password, visible, language, deviceToken
  } = req.body
  if (!(given_name && family_name && email && password && visible !== undefined && language)) {
    return res.status(400).send('Bad Request')
  }
  try {
    const user = await User.findOne({ email })
    if (user) {
      return res.status(409).send('User already exists')
    }
    const user_id = objectid()
    const address_id = objectid()
    const image_id = objectid()
    const token = jwt.sign({ user_id, email }, process.env.SERVER_SECRET)
    const newUser = {
      user_id,
      provider: 'families_share',
      email,
      token,
      password,
      language,
      last_login: new Date()
    }
    const profile = {
      given_name,
      family_name,
      user_id,
      email,
      phone: number,
      phone_type: 'unspecified',
      visible,
      image_id,
      address_id
    }
    const image = {
      image_id,
      owner_type: 'user',
      owner_id: user_id,
      path: '/images/profiles/user_default_photo.png',
      thumbnail_path: '/images/profiles/user_default_photo.png'
    }
    const address = {
      address_id,
      street: '',
      number: '',
      city: ''
    }
    const rating = {
      user_id,
      rating: 0
    }
    if (deviceToken !== undefined && deviceToken !== null) {
      const device = await Device.findOne({ device_id: deviceToken })
      if (device) {
        device.user_id = user_id
        await device.save()
      } else {
        await Device.create({
          user_id,
          device_id: deviceToken
        })
      }
    }
    await User.create(newUser)
    await Profile.create(profile)
    await Image.create(image)
    await Address.create(address)
    await Rating.create(rating)
    const response = {
      id: user_id,
      email,
      name: `${given_name} ${family_name}`,
      image: '/images/profiles/user_default_photo.png',
      token
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
})

router.post('/authenticate/email', async (req, res, next) => {
  const {
    email, password, deviceToken, language
  } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send('Authentication failure')
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
      return res.status(401).send('Authentication failure')
    }
    if (deviceToken !== undefined && deviceToken !== null) {
      const device = await Device.findOne({ device_id: deviceToken })
      if (device) {
        device.user_id = user.user_id
        device.save()
      } else {
        await Device.create({
          user_id: user.user_id,
          device_id: deviceToken
        })
      }
    }
    const profile = await Profile.findOne({ user_id: user.user_id })
      .populate('image')
      .lean()
      .exec()
    const token = jwt.sign(
      { user_id: user.user_id, email },
      process.env.SERVER_SECRET
    )
    const response = {
      id: user.user_id,
      email,
      name: `${profile.given_name} ${profile.family_name}`,
      image: profile.image.path,
      token
    }
    user.last_login = new Date();
		user.language = language;
		user.token = token;
    await user.save()
    res.json(response)
  } catch (error) {
    next(error)
  }
})

router.post('/authenticate/google', async (req, res, next) => {
  const { deviceToken, language, origin } = req.body
  let googleProfile, googleToken
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
      if (deviceToken !== undefined && deviceToken !== null) {
        const device = await Device.findOne({ device_id: deviceToken })
        if (device) {
          device.user_id = user.user_id
          await device.save()
        } else {
          await Device.create({
            user_id: user.user_id,
            device_id: deviceToken
          })
        }
      }
      const profile = await Profile.findOne({ user_id: user.user_id }).populate('image').lean().exec()
      const token = jwt.sign({ user_id: user.user_id, email: googleProfile.email }, process.env.SERVER_SECRET)
      const response = {
        id: profile.user_id,
        email: profile.email,
        name: `${profile.given_name} ${profile.family_name}`,
        image: profile.image.path,
        token,
        google_token: googleToken,
        origin: req.body.origin
      }
      user.last_login = new Date()
			user.language = language
			user.token = token;
			user.auth0_token = googleToken;
      await user.save()
      res.json(response)
    } else {
      const user_id = objectid()
      if (deviceToken !== undefined && deviceToken !== null) {
        const device = await Device.findOne({ device_id: deviceToken })
        if (device) {
          device.user_id = user_id
          await device.save()
        } else {
          await Device.create({
            user_id,
            device_id: deviceToken
          })
        }
      }
      const address_id = objectid()
      const image_id = objectid()
      const token = jwt.sign({ user_id, email: googleProfile.email }, process.env.SERVER_SECRET)
      const user = {
        user_id,
        provider: 'google',
        email: googleProfile.email,
        token,
        auth0_token: googleToken,
        language,
        last_login: new Date()
      }
      const profile = {
        given_name: googleProfile.givenName,
        family_name: googleProfile.familyName,
        user_id,
        email: googleProfile.email,
        phone: '',
        phone_type: 'mobile',
        visible: true,
        image_id,
        address_id
      }
      const image = {
        image_id,
        owner_type: 'user',
        owner_id: user_id,
        path: req.body.origin === 'native' ? googleProfile.photo : googleProfile.imageUrl,
        thumbnail_path: req.body.origin === 'native' ? googleProfile.photo : googleProfile.imageUrl
      }
      const address = {
        address_id,
        street: '',
        number: '',
        city: ''
      }
      const rating = {
        user_id,
        rating: 0
      }
      await User.create(user)
      await Profile.create(profile)
      await Image.create(image)
      await Address.create(address)
      await Rating.create(rating)
      res.json({
        id: user_id,
        token,
        google_token: googleToken,
        origin: req.body.origin,
        email: googleProfile.email,
        name: `${googleProfile.givenName} ${googleProfile.familyName}`,
        image: req.body.origin === 'native' ? googleProfile.photo : googleProfile.imageUrl
      })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/changepasswordredirect/:token', (req, res) => {
  res.redirect(`families-share://changepsw/${req.params.token}`)
})

router.post('/forgotpassword', async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).send("User doesn't exist")
    }
    const token = await jwt.sign({ user_id: user.user_id, email }, process.env.SERVER_SECRET, { expiresIn: 60 * 60 * 24 })
    const mailOptions = {
      from: process.env.SERVER_MAIL,
      to: email,
      subject: 'Forgot Password',
      html: hf.newForgotPasswordEmail(token)
    }
    const reset = await Password_Reset.findOne({ user_id: user.user_id, email })
    if (reset) {
      reset.token = token
      await reset.save()
    } else {
      await Password_Reset.create({
        user_id: user.user_id,
        email: user.email,
        token
      })
    }
    await transporter.sendMail(mailOptions)
    res.status(200).send('Forgot password email was sent')
  } catch (error) {
    next(error)
  }
})

router.get('/changepassword', (req, res, next) => {
	if (!req.user_id) { return res.status(401).send('Invalid token') }
	const { user_id } = req
	Password_Reset.findOne({ token: req.headers.authorization }).then(reset => {
		if (!reset) {
			return res.status(404).send('Bad Request')
		}
		return Profile.findOne({ user_id }).populate('image')
			.lean()
			.exec()
			.then(profile => {
				res.json(profile)
			})
	}).catch(next)
})

router.post('/changepassword', async (req, res, next) => {
	if (!req.user_id) { return res.status(401).send('Not authorized') }
  try {
    const { user_id, email } = req
    const reset = await Password_Reset.findOneAndDelete({ user_id })
    if (!reset) {
      return res.status(404).send('Reset not found')
    }
    const profile = await Profile.findOne({ user_id }).populate('image').exec()
    const user = await User.findOne({ user_id })
    const token = await jwt.sign({ user_id, email }, process.env.SERVER_SECRET)
    const response = {
      id: user_id,
      email,
      name: `${profile.given_name} ${profile.family_name}`,
      image: profile.image.path,
      token
    }
    user.last_login = new Date()
    user.password = req.body.password
    await user.save()
    res.json(response)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const { id } = req.params
  User.findOne({ user_id: id }).then(user => {
    if (!user) {
      return res.status(404).send("User doesn't exist")
    }
    res.json(user)
  }).catch(next)
})

router.delete('/:id', async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const user_id = req.params.id
  try {
    await User.deleteOne({ user_id })
    await Password_Reset.deleteOne({ user_id })
    const profile = await Profile.findOne({ user_id })
    await Address.deleteOne({ address_id: profile.address_id })
    await Image.deleteOne({ image_id: profile.image_id })
    await Profile.deleteOne({ user_id })
    const childDeleteIds = []
    const parents = await Parent.find({})
    const usersChildren = parents.filter(parent => parent.parent_id === user_id)
    usersChildren.forEach(child => {
      if (parents.filter(parent => parent.child_id === child.child_id).length === 1) {
        childDeleteIds.push(child.child_id)
      }
    })
    await Parent.deleteMany({ parent_id: user_id })
    await Child.deleteMany({ child_id: { $in: childDeleteIds } })
    await Image.deleteMany({ owner_id: { $in: childDeleteIds } })
    // await Framily.deleteMany({ user_id});
    // await Framily.deleteMany({ framily_id: user_id });
    const announcements = await Announcement.find({ user_id })
    const announcementIds = announcements.map(announcement => announcement.announcement_id)
    await Image.deleteMany({ owner_id: { $in: announcementIds } })
    await Announcement.deleteMany({ user_id })
    await Reply.deleteMany({ user_id })
    const memberships = await Member.find({ user_id, group_accepted: true, user_accepted: true })
    const groupIds = memberships.map(membership => membership.group_id)
    const groups = await Group.find({ group_id: { $in: groupIds } })
    await Promise.all(groups.map(async (group) => {
      const response = await calendar.events.list({ calendarId: group.calendar_id })
      const groupEvents = response.data.items
      await Promise.all(groupEvents.map(async (event) => {
        const parentParticipants = JSON.parse(event.extendedProperties.shared.parents)
        const childParticipants = JSON.parse(event.extendedProperties.shared.children)
        const filteredParents = parentParticipants.filter(id => id !== user_id)
        const filteredChildren = childParticipants.filter(id => childDeleteIds.indexOf(id) === -1)
        if (filteredParents.length !== parentParticipants.length || filteredChildren.length !== childParticipants.length) {
          const timeslotPatch = {
            extendedProperties: {
              shared: {
                parents: JSON.stringify(filteredParents),
                children: JSON.stringify(filteredChildren)
              }
            }
          }
          await calendar.events.patch({ calendarId: group.calendar_id, eventId: event.id, resource: timeslotPatch })
        }
      }))
    }))
    await Member.deleteMany({ user_id })
    res.status(200).send('account deleted')
  } catch (error) {
    next(error)
  }
})

router.get('/:id/rating', (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  Rating.findOne({ user_id: req.params.id }).then(rating => {
    res.json(rating)
  }).catch(next)
})

router.patch('/:id/rating', (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  if (!req.body.rating) {
    return res.status(400).send('Bad Request')
  }
  Rating.updateOne({ user_id: req.params.id }, { rating: req.body.rating }).then(() => {
    res.status(200).send('Rating updated')
  }).catch(next)
})

router.get('/:id/groups', (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const { user_id } = req
  Member.find({ user_id }).then(groups => {
    if (groups.length === 0) {
      return res.status(404).send("User hasn't joined any groups")
    }
    res.json(groups)
  }).catch(next)
})

router.post('/:id/walkthrough', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  try {
    const { user_id, email } = req;
    const profile = await Profile.findOne({ user_id })
    const mailOptions = {
      from: process.env.SERVER_MAIL,
      to: email,
      subject: 'Platform walkthrough',
      html: wt.newWalkthroughEmail(profile.given_name),
      attachments: [
        {
          filename: 'Families_Share_Walkthrough.pdf',
          path: path.join(__dirname, '../../Families_Share_Walkthrough.pdf')
        }

      ]
    }
    await transporter.sendMail(mailOptions)
    res.status(200).send('Walkthrough was sent successfully')
  } catch (error) {
    next(error)
  }
})

router.post('/:id/groups', (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const { user_id } = req
  const { group_id } = req.body
  if (!group_id) {
    return res.status(400).send('Bad Request')
  }
  const member = {
    group_id,
    user_id,
    admin: false,
    user_accepted: true,
    group_accepted: false
  }
  Member.create(member).then(() => {
    res.status(200).send('Joined succesfully')
  }).catch(next)
})

router.patch('/:userId/groups/:groupId', (req, res, next) => {
  if (req.user_id !== req.params.userId) { return res.status(401).send('Unauthorized') }
  const group_id = req.params.groupId
  const user_id = req.params.userId
  Member.updateOne({ user_id, group_id }, { user_accepted: true }).then(() => {
    nh.newMemberNotification(group_id, user_id)
    res.status(200).send('User joined')
  }).catch(next)
})

router.delete('/:userId/groups/:groupId', async (req, res, next) => {
  if (req.user_id !== req.params.userId) { return res.status(401).send('Unauthorized') }
  try {
    const user_id = req.params.userId
    const group_id = req.params.groupId
    const children = await Parent.find({ parent_id: user_id })
    const usersChildrenIds = children.map(child => child.child_id)
    const group = await Group.findOne({ group_id })
    const resp = await calendar.events.list({ calendarId: group.calendar_id })
    const events = resp.data.items.filter(event => event.extendedProperties.shared.status !== 'completed')
    events.forEach((event) => {
      const parentIds = JSON.parse(event.extendedProperties.shared.parents)
      event.extendedProperties.shared.parents = JSON.stringify(parentIds.filter(id => id !== user_id))
      const childrenIds = JSON.parse(event.extendedProperties.shared.children)
      event.extendedProperties.shared.children = JSON.stringify(childrenIds.filter(id => usersChildrenIds.indexOf(id) === -1))
    })
    await Promise.all(events.map((event) => {
      const timeslotPatch = {
        extendedProperties: {
          shared: {
            parents: event.extendedProperties.shared.parents,
            children: event.extendedProperties.shared.children
          }
        }
      }
      calendar.events.patch({ calendarId: group.calendar_id, eventId: event.id, resource: timeslotPatch })
    }))
    await Member.deleteOne({ user_id, group_id })
    res.status(200).send('User left group')
  } catch (error) {
    next(error)
  }
})

router.post('/:id/export', async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const { user_id, email } = req
  try {
    const profile = await Profile.findOne({ user_id }).populate('address').populate('image').lean().exec()
    const usersGroups = await Member.find({ user_id, user_accepted: true, group_accepted: true })
    const groups = await Group.find({ group_id: { $in: usersGroups.map(group => group.group_id) } })
    const usersChildren = await Parent.find({ parent_id: user_id })
    const childIds = usersChildren.map(child => child.child_id)
    const children = await Child.find({ child_id: { $in: childIds } }).populate('image').lean().exec()
    const responses = await Promise.all(groups.map(group => uh.getUsersGroupEvents(group.calendar_id, user_id, childIds)))
    const events = [].concat(...responses)
    exportData.createPdf(profile, groups, children, events, () => {
      const mailOptions = {
        from: process.env.SERVER_MAIL,
        to: email,
        subject: `${profile.given_name} ${profile.family_name} Families Share Data`,
        html: exportData.newExportEmail(profile.given_name),
        attachments: [
          {
            filename: `${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf`,
            path: path.join(__dirname, `../../${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf`)
          }
        ]
      }
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) next(err)
        fr('../', { files: `${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf` })
      })
      res.status(200).send('Exported data successfully')
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id/events', async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  try {
    const user_id = req.params.id
    const usersGroups = await Member.find({ user_id, user_accepted: true, group_accepted: true })
    const groups = await Group.find({ group_id: { $in: usersGroups.map(group => group.group_id) } })
    const children = await Parent.find({ parent_id: user_id })
    const childIds = children.map(parent => parent.child_id)
    const responses = await Promise.all(groups.map(group => uh.getUsersGroupEvents(group.calendar_id, user_id, childIds)))
    const events = [].concat(...responses)
    if (events.length === 0) {
      return res.status(404).send("User's calendar has no events")
    }
    res.status(200).json(events)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/profile', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Unauthorized') }
  const user_id = req.params.id
  Profile.findOne({ user_id })
    .populate('image')
    .populate('address')
    .lean()
    .exec()
    .then(profile => {
      if (!profile) {
        return res.status(404).send('Profile not found')
      }
      res.json(profile)
    }).catch(next)
})

router.patch('/:id/profile', profileUpload.single('photo'), async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const user_id = req.params.id
  const { file } = req
  const {
    given_name, family_name, email, phone, phone_type, visible, street, number, city
  } = req.body
  if (!(given_name || family_name || email || phone || phone_type || visible !== undefined || street || number || city)) {
    return res.status(400).send('Bad Request')
  }
  const profilePatch = {
    given_name,
    family_name,
    email,
    phone,
    phone_type,
    visible
  }
  const addressPatch = {
    street,
    number,
    city
  }
  try {
    await Address.updateOne({ address_id: req.body.address_id }, addressPatch)
    await Profile.updateOne({ user_id }, profilePatch)
    if (file) {
      const fileName = file.filename.split('.')
      const imagePatch = {
        path: `/images/profiles/${file.filename}`,
        thumbnail_path: `/images/profiles/${fileName[0]}_t.${fileName[1]}`
      }
      await sharp(path.join(__dirname, `../../images/profiles/${file.filename}`))
        .resize({
          height: 200,
          fit: sharp.fit.cover
        })
        .toFile(path.join(__dirname, `../../images/profiles/${fileName[0]}_t.${fileName[1]}`))
      await Image.updateOne({ owner_type: 'user', owner_id: user_id }, imagePatch)
    }
    res.status(200).send('Profile Updated')
  } catch (error) {
    next(error)
  }
})

router.get('/:id/notifications', async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
	const user_id = req.params.id;
	const page = req.query.page;
  try {
		const user = await User.findOne({ user_id })
		const notifications = await Notification.find({ owner_id: user_id })
		.sort({ createdAt: -1 })
		.skip(page*10)
		.limit(10)
		.lean()
    if (notifications.length === 0) {
      return res.status(404).send('User has no notifications')
    }
    notifications.forEach( notification => {
      notification.header = texts[user.language][notification.type][notification.code].header
      notification.description =  nh.getNotificationDescription(notification, user.language)
    })
    return res.json(notifications)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/notifications/unread', async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const user_id = req.params.id
	Notification.find({ owner_id: user_id, read: false}).then( unreadNotifications => {
    if (unreadNotifications.length === 0) {
      return res.status(404).send('User has no notifications')
		}
    return res.status(200).send({unreadNotifications: unreadNotifications.length})
  }).catch(next)
})

router.patch('/:id/notifications', (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const user_id = req.params.id
  Notification.updateMany({ owner_id: user_id, read: false }, { read: true }).then(() => {
    res.status(200).send('Notifications updated')
  }).catch(next)
})

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
})

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
})

router.get('/:id/children', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Unauthorized') }
  const { id } = req.params
  Parent.find({ parent_id: id }).then(children => {
    if (children.length === 0) {
      return res.status(404).send('User has no children')
    }
    res.json(children)
  }).catch(next)
})

router.post('/:id/children', async (req, res, next) => {
  if (req.user_id !== req.params.id) { return res.status(401).send('Unauthorized') }
  const {
    birthdate, given_name, family_name, gender, allergies, other_info, special_needs
  } = req.body
  if (!(birthdate && given_name && family_name && gender)) {
    return res.status(400).send('Bad Request')
  }
  const parent_id = req.params.id
  const child = {
    birthdate,
    given_name,
    family_name,
    gender,
    allergies,
    other_info,
    special_needs
  }
  const image_id = objectid()
  const child_id = objectid()
  const image = {
    image_id,
    owner_type: 'child',
    owner_id: child_id,
    path: '/images/profiles/child_default_photo.jpg'
  }
  child.child_id = child_id
  child.background = '#00838F'
  child.image_id = image_id
  const parent = {
    parent_id,
    child_id
  }
  try {
    await Image.create(image)
    await Child.create(child)
    await Parent.create(parent)
    res.status(200).send('Child created')
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/children/:childId', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Unauthorized') }
  const child_id = req.params.childId
  Child.findOne({ child_id })
    .populate('image')
    .lean()
    .exec()
    .then(child => {
      if (!child) {
        return res.status(404).send('Child not found')
      }
      res.json(child)
    }).catch(next)
})

router.patch('/:userId/children/:childId', childProfileUpload.single('photo'), async (req, res, next) => {
  if (req.user_id !== req.params.userId) { return res.status(401).send('Unauthorized') }
  const { file } = req
  const child_id = req.params.childId
  const {
    given_name, family_name, gender, birthdate, background, allergies, other_info, special_needs
  } = req.body
  const childPatch = {
    given_name,
    family_name,
    gender,
    birthdate,
    background,
    allergies,
    other_info,
    special_needs
  }
  if (!(given_name || family_name || gender || birthdate || background || allergies || other_info || special_needs)) {
    return res.status(400).send('Bad Request')
  }
  try {
    await Child.updateOne({ child_id }, childPatch)
    if (file) {
      const fileName = file.filename.split('.')
      const imagePatch = {
        path: `/images/profiles/${file.filename}`,
        thumbnail_path: `/images/profiles/${fileName[0]}_t.${fileName[1]}`
      }
      await sharp(path.join(__dirname, `../../images/profiles/${file.filename}`))
        .resize({
          height: 200,
          fit: sharp.fit.cover
        })
        .toFile(path.join(__dirname, `../../images/profiles/${fileName[0]}_t.${fileName[1]}`))
      await Image.updateOne({ owner_type: 'child', owner_id: child_id }, imagePatch)
    }
    res.status(200).send(' Child Profile Updated')
  } catch (error) {
    next(error)
  }
})

router.delete('/:userId/children/:childId', async (req, res, next) => {
  if (req.user_id !== req.params.userId) { return res.status(401).send('Unauthorized') }
  const user_id = req.params.userId
  const child_id = req.params.childId
  try {
    const memberships = await Member.find({ user_id })
    const groupIds = memberships.map(membership => membership.group_id)
    const userGroups = await Group.find({ group_id: { $in: groupIds } })
    await Promise.all(userGroups.map((group) => { uh.unsubcribeChildFromGroupEvents(group.calendar_id, child_id) }))
    await Child.deleteOne({ child_id })
    await Parent.deleteMany({ child_id })
    await Image.deleteOne({ owner_id: child_id })
    res.status(200).send('Child deleted')
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/children/:childId/parents', (req, res, next) => {
	if (!req.user_id) { return res.status(401).send('Unauthorized') }
	const child_id = req.params.childId
	Parent.find({ child_id }).then(parents => {
		if (parents.length === 0) {
			res.status(404).send('Parents not found')
		}
		const parentIds = parents.map(parent => parent.parent_id)
		return Profile.find({ user_id: { $in: parentIds } })
	}).then(parentProfiles => {
		res.json(parentProfiles)
	}).catch(next)
})

router.post('/:userId/children/:childId/parents', (req, res, next) => {
	if (req.user_id !== req.params.userId) { return res.status(401).send('Unauthorized'); }
	const { parentId } = req.body
	const child_id = req.params.childId
	Parent.find({ child_id }).then(parents => {
		if (parents.length >= 2 || !parentId) {
			return res.status(400).send('Bad Request');
		}
		return Parent.create({
			parent_id: parentId,
			child_id
		}).then(() => {
			res.status(200).send('Parent added')
		})
	}).catch(next)
})

router.delete('/:userId/children/:childId/parents/:parentId', (req, res, next) => {
  if (req.user_id !== req.params.userId) { return res.status(401).send('Unauthorized') }
  const { parentId } = req.params
  const child_id = req.params.childId
  Parent.deleteOne({ child_id, parent_id: parentId }).then(() => {
    res.status(200).send('Parent deleted')
  }).catch(next)
})

module.exports = router

router.post('/:userId/sendmenotification', async (req, res, next) => {
  // Device.find({ user_id: req.params.userId }).then(devices => {
  //   if (devices) {
  //     devices.forEach((device) => {
  //       const message = {
  //         notification: { title: 'Welcome', body: 'Families Share welcomes you to our community' },
  //         token: device.device_id
  //       }
  //       fbadmin.messaging().send(message)
  //         .then((response) => {
  //           console.log('Successfully sent message:', response)
  //         })
  //         .catch((error) => {
  //           if (error.code === 'messaging/registration-token-not-registered') {
  //             Device.deleteOne({ device_id: device.device_id })
  //           }
  //         })
  //     })
  //   }
  //   res.status(200).send('Push notification sent')
  // }).catch(next)
  try{
    const groups = await Group.find({}).lean().exec()
    for (const group of groups ){
      console.log(group.name)
      if(group.name && group.description && group.location){
      const newCal = {
        summary: group.name,
        description: group.description,
        location: group.location
      }
      const response = await calendar.calendars.insert({ resource: newCal })
      console.log(response.data.id)
      group.calendar_id = response.data.id
      await group.save();
    }
    }
  }catch(error){
    console.log(error)
  }
})
