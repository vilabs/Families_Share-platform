const { google } = require('googleapis')
require('dotenv').config()
const config = require('config')
const googleEmail = config.get('google.email')
const googleKey = config.get('google.key')

const scopes = 'https://www.googleapis.com/auth/calendar'
const jwt = new google.auth.JWT(process.env[googleEmail], null, process.env[googleKey].replace(/\\n/g, '\n'), scopes)

const calendar = google.calendar({
  version: 'v3',
  auth: jwt
})

// delete calendars
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		calendar.calendars.delete({calendarId: cal.id}, (err,resp)=>{
// 			if (err) console.log(err);
// 			console.log(`Deleted calendar with id ${cal.id} `)
// 		})
// 	});
// })

// show calendars
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		console.log(cal)
// 	});
// })

// delete events from calendar
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		calendar.events.list({calendarId: cal.id},(err,resp)=>{
// 			if (err) console.log(err);
// 			resp.data.items.forEach( event => {
// 				calendar.events.delete({eventId: event.id, calendarId: cal.id}, (er, res)=>{
// 					if(er) console.log(er)
// 					console.log("deleted event with id "+event.id)
// 				})
// 			})
// 		})
// 	});
// })

// Patch All events
// calendar.calendarList.list({ }, async (error, response) => {
//   if (error) console.log(error)
//   for (const cal of response.data.items) {
//     try {
//       const eventsResp = await calendar.events.list({ calendarId: cal.id })
//       for (const item of eventsResp.data.items) {
//         const timeslotPatch = {
//           extendedProperties: {
//             shared: {
//               externals: JSON.stringify([])
//             }
//           }
//         }
//         console.log(item.summary)
//         const patchResp = await calendar.events.patch({ calendarId: cal.id, eventId: item.id, resource: timeslotPatch })
//       }
//     } catch (err) {
//       console.log(err)
//     }
//   }
// })
