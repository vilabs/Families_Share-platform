const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/calendar'
const googleToken = new google.auth.GoogleAuth(
  {
    keyFile: process.env['GOOGLE_CALENDAR_API_KEYFILE'],
    scopes: scopes
  }
)
const calendar = google.calendar({
  version: 'v3',
  auth: googleToken
})

const Activity = require('../models/activity')

const checkCompletedTimeslots = async () => {
  try {
    const calendarsResponse = await calendar.calendarList.list({})
    const calendars = calendarsResponse.data.items
    for (const cal of calendars) {
      const eventResponse = await calendar.events.list({ calendarId: cal.id, sharedExtendedProperty: 'status=ongoing' })
      const events = eventResponse.data.items
      const filteredEvents = events.filter(event => {
        const start = new Date(event.start.dateTime).getTime()
        const now = new Date().getTime()
        return start < now
      })
      const timeslotPatch = {
        extendedProperties: {
          shared: {
            status: 'completed'
          }
        }
      }
      for (const event of filteredEvents) {
        await calendar.events.patch({
          calendarId: event.organizer.email,
          eventId: event.id,
          resource: timeslotPatch
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const fetchAllGroupEvents = async (groupId, calendarId) => {
  const pendingActivities = await Activity.find({ group_id: groupId, status: 'pending' }).distinct('activity_id')
  let events = []
  let nextPageToken = null

  do {
    let resp
    if (nextPageToken) {
      resp = await calendar.events.list({ calendarId, maxResults: 250, pageToken: nextPageToken })
    } else {
      resp = await calendar.events.list({ calendarId, maxResults: 250 })
    }
    const pageEvents = resp.data.items
    const pageAcceptedEvents = pageEvents.filter(event => pendingActivities.indexOf(event.extendedProperties.shared.activityId) === -1)
    events = events.concat(pageAcceptedEvents)
    nextPageToken = resp.data.nextPageToken
  } while (nextPageToken)
  return events
}

module.exports = {
  checkCompletedTimeslots,
  fetchAllGroupEvents
}
