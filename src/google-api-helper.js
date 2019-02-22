const {google} = require('googleapis');
const key = require('./auth.json');
const scopes = 'https://www.googleapis.com/auth/calendar';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)


const calendar = google.calendar({ 
	version: 'v3',
	auth: jwt,
});

//delete calendars
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		calendar.calendars.delete({calendarId: cal.id}, (err,resp)=>{
// 			if (err) console.log(err);
// 			console.log(`Deleted calendar with id ${cal.id} `)
// 		})
// 	});
// })


//show calendars
// calendar.calendarList.list({ }, (error, response) => {
// 	if (error) console.log(error);
// 	response.data.items.forEach( cal => {
// 		console.log(cal)
// 	});
// })


//delete events from calendar
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

//show calendar events
// calendar.calendarList.list({ }, async (error, response) => {
// 	if (error) console.log(error);
// 	for (const cal of response.data.items) {
// 		calendar.events.list({ calendarId: cal.id }, async (err, resp) => {
// 			if (err) console.log(err)
// 			console.log(resp.data.items)
// 		})
// 	}
// })