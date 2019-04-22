const { google } = require('googleapis')

const scopes = 'https://www.googleapis.com/auth/calendar'
const googleToken = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes
)
const calendar = google.calendar({
  version: 'v3',
  auth: googleToken
})

const getUsersGroupEvents = (calId, userId, usersChildrenIds) =>
  new Promise((resolve, reject) => {
    calendar.events.list({ calendarId: calId }, function (err, response) {
      if (err) {
        reject(err)
      }
      const usersEvents = response.data.items.filter(event => {
        if (
          event.extendedProperties.shared.parents !== undefined &&
          event.extendedProperties.shared.children !== undefined
        ) {
          const parentIds = JSON.parse(event.extendedProperties.shared.parents)
          const childrenIds = JSON.parse(
            event.extendedProperties.shared.children
          )
          const fixedFlag =
            event.extendedProperties.shared.status === 'confirmed'
          const userFlag = parentIds.indexOf(userId) !== -1
          const childFlag =
            usersChildrenIds.filter(
              childId => childrenIds.indexOf(childId) !== -1
            ).length > 0
          if (fixedFlag && (userFlag || childFlag)) {
            return true
          } else {
            return false
          }
        }
      })
      resolve(usersEvents)
    })
  })

const unsubcribeChildFromGroupEvents = (calendar_id, child_id) =>
  new Promise(async (resolve, reject) => {
    try {
      const resp = await calendar.events.list({ calendarId: calendar_id })
      const events = resp.data.items.filter(
        event => event.extendedProperties.shared.status !== 'completed'
      )
      events.forEach(event => {
        const childrenIds = JSON.parse(
          event.extendedProperties.shared.children
        )
        event.extendedProperties.shared.children = JSON.stringify(
          childrenIds.filter(id => id !== child_id)
        )
      })
      await Promise.all(
        events.map(event => {
          const timeslotPatch = {
            extendedProperties: {
              shared: {
                children: event.extendedProperties.shared.children
              }
            }
          }
          calendar.events.patch({
            calendarId: calendar_id,
            eventId: event.id,
            resource: timeslotPatch
          })
        })
      )
      resolve('done')
    } catch (error) {
      reject(error)
    }
  })

module.exports = {
  unsubcribeChildFromGroupEvents,
  getUsersGroupEvents
}
