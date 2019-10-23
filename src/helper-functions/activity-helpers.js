const { google } = require('googleapis')
const config = require('config')
const googleEmail = config.get('google.email')
const googleKey = config.get('google.key')
const scopes = 'https://www.googleapis.com/auth/calendar'
const googleToken = new google.auth.JWT(
  process.env[googleEmail],
  null,
  process.env[googleKey].replace(/\\n/g, '\n'),
  scopes
)
const calendar = google.calendar({
  version: 'v3',
  auth: googleToken
})

const checkCompletedTimeslots = async () => {
  try {
    const calendarsResponse = await calendar.calendarList.list({})
    const calendars = calendarsResponse.data.items
    const eventResponses = await Promise.all(calendars.map(cal => calendar.events.list({ calendarId: cal.id })))
    const events = [].concat(...eventResponses.map(e => e.data.items))
    const filteredEvents = events.filter(event => {
      const start = new Date(event.start.dateTime).getTime()
      const now = new Date().getTime()
      return start < now
    })
    console.log(filteredEvents.length)
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
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  checkCompletedTimeslots
}
