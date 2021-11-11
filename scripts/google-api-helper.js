const { google } = require('googleapis')
require('dotenv').config()
const config = require('config')
const inquirer = require('inquirer')
const googleEmail = config.get('google.email')
const googleKey = config.get('google.key')

const scopes = ['https://www.googleapis.com/auth/calendar']
const jwt = new google.auth.GoogleAuth(
  {
    keyFile: process.env[config.get('google.keyfile')],
    scopes: scopes
  }
)
const calendar = google.calendar({
  version: 'v3',
  auth: jwt
})

const question = [
  {
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    // eslint-disable-next-line no-sparse-arrays
    choices: ['Show calendar', /* 'Show events', */ 'Delete all calendars', 'Delete all events', 'Update all events', 'Exit']
  }
]
showMenu()

function showMenu () {
  inquirer.prompt(question).then((answers) => {
    console.log(JSON.stringify(answers, null, '  '))
    switch (answers.action) {
      case 'Show calendar':
        showCalendar()
        break
      // case 'Show events':
      //   showEvents()
      //   break
      case 'Delete all calendars':
        deleteCalendars()
        break
      case 'Delete all events':
        deleteAllEvents()
        break
      case 'Update all events':
        updateAllEvents()
        break
      case 'Exit':
        process.exit(1)
    }
    showMenu()
  })
}

// delete calendars
function deleteCalendars () {
  calendar.calendarList.list({}, (error, response) => {
    if (error) console.log(error)
    response.data.items.forEach(cal => {
      calendar.calendars.delete({ calendarId: cal.id }, (err, resp) => {
        if (err) console.log(err)
        console.log(`Deleted calendar with id ${cal.id} `)
      })
    })
  })
}

// show calendars
function showCalendar () {
  calendar.calendarList.list({}, (error, response) => {
    if (error) console.log(error)
    response.data.items.forEach(cal => {
      console.log(cal)
    })
  })
}

// delete events from calendar
function deleteAllEvents () {
  calendar.calendarList.list({}, (error, response) => {
    if (error) console.log(error)
    response.data.items.forEach(cal => {
      calendar.events.list({ calendarId: cal.id }, (err, resp) => {
        if (err) console.log(err)
        resp.data.items.forEach(event => {
          calendar.events.delete({ eventId: event.id, calendarId: cal.id }, (er, res) => {
            if (er) console.log(er)
            console.log('deleted event with id ' + event.id)
          })
        })
      })
    })
  })
}

// show events from calendar
// function showEvents () {
//   calendar.events.list({
//     calendarId: '36c14k3ur2jfqrmsfel4qgm7qo@group.calendar.google.com',
//     sharedExtendedProperty: 'activityId=5eeb4c02dab6d2b705000002'
//   }, (err, resp) => {
//     if (err) console.log(err)
//     console.log(resp.data.items.filter(e => e.id === 'hh87c1kra5eigfqo6a73oua0tk'))
//   })
// }

// Patch All events
function updateAllEvents () {
  calendar.calendarList.list({}, async (error, response) => {
    if (error) console.log(error)
    for (const cal of response.data.items) {
      try {
        const eventsResp = await calendar.events.list({ calendarId: cal.id })
        for (const item of eventsResp.data.items) {
          const timeslotPatch = {
            extendedProperties: {
              shared: {
                externals: JSON.stringify([])
              }
            }
          }
          console.log(item.summary)
          const patchResp = await calendar.events.patch({
            calendarId: cal.id,
            eventId: item.id,
            resource: timeslotPatch
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
}

// Update specific event
/*
calendar.events.patch({ calendarId: '7tgsm96jhoob4r1kpqc1q2e3e4@group.calendar.google.com',
  eventId: '5c6g83dob0a31ev92oa78v5hoo',
  resource: {
    extendedProperties: {
      shared: {
        children: JSON.stringify(['5e5040e80184aa3101000004', '5e50410e51a97d5401000005', '5ecbb866ddbe65c4040000d3', '5eaf09533e42289802000088', '5f6f00a06defc11611000018', '5f6f00c353add7671100000a', '5f6f00dc77406bfb1000000c', '5f5b3c1f7a7443e90d00006b', '5f708f587f644cc510000026', '5f708e4af4b0a5aa1000001f', '5f70d78e646a5b4c11000013', '5f719c77c12ff23111000058', '5eaf1d453e422898020000bd', '5f71d9ce646a5b4c11000018', '5f71e4ae53add76711000030', '5e5f7e6c4f4ebe4d01000126', '5eaf23fc3e422898020000c8', '5eaf23c83e422898020000c6', '5f58c0e97a7443e90d000061', '5f5dfcebccb2890d0e00004c', '5f73512377406bfb100000bc', '5e526bdf500e746e01000012', '5e526bf651a97d540100001c', '5f7359e57f644cc510000088', '5d131cc8125edf4201000002', '5d131cc8125edf4201000004', '5d131cc8cbc9f30501000002', '5f7385186defc11611000076', '5eaf07603e42289802000084', '5f738c7977406bfb100000da', '5f7392956defc1161100007a', '5f7392db77406bfb100000dc', '5f73a4b97f644cc5100000c7', '5f7456947f644cc5100000c9', '5f7456b653add7671100008f', '5f7487a55e64f56e1500000']) }
    }
  }
}, async (error, response) => {
  if (error) console.log(error)
  console.log(response.data)
})
 */

// Get specific event
// calendar.events.get({ calendarId: '7tgsm96jhoob4r1kpqc1q2e3e4@group.calendar.google.com',
//   eventId: '5c6g83dob0a31ev92oa78v5hoo'
// }, async (error, response) => {
//   if (error) console.log(error)
//   console.log(response.data)
// })
