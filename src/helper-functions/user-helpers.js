const { google } = require('googleapis');

const scopes = 'https://www.googleapis.com/auth/calendar';
const googleToken = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes);
const calendar = google.calendar({
  version: 'v3',
  auth: googleToken,
});
const texts = require('../constants/notification-texts');

const getUsersGroupEvents = (calId, userId, usersChildrenIds) => new Promise((resolve, reject) => {
  calendar.events.list({ calendarId: calId }, (err, response) => {
    if (err) {
      reject([]);
    } else {
      const usersEvents = response.data.items.filter((event) => {
        const parentIds = JSON.parse(event.extendedProperties.shared.parents);
        const childrenIds = JSON.parse(event.extendedProperties.shared.children);
        const fixedFlag = event.extendedProperties.shared.status === 'fixed';
        const userFlag = parentIds.indexOf(userId) !== -1;
        const childFlag = usersChildrenIds.filter(childId => childrenIds.indexOf(childId) !== -1).length > 0;
        if (fixedFlag && (userFlag || childFlag)) {
          return true;
        } else {
          return false;
        }
      });
      resolve(usersEvents);
    }
  });
});

const getNotificationDescription = (notification, language) => {
  const {
    type, code, subject, object,
  } = notification;
  const { description } = texts[language][type][code];

  switch (type) {
    case 'group':
      switch (code) {
        case 0:
          return `${subject}${description}${object}`;
        case 1:
          return 	`${description}${object}`;
        default:
          return '';
      }
    default:
      return '';
  }
};
const unsubcribeChildFromGroupEvents = (calendar_id, child_id) => new Promise((resolve, reject) => {
  calendar.events.list({ calendarId: calendar_id }, async (err, resp) => {
    try {
      const events = resp.data.items.filter(event => event.extendedProperties.shared.status !== 'completed');
      events.forEach((event) => {
        const childrenIds = JSON.parse(event.extendedProperties.shared.children);
        event.extendedProperties.shared.children = JSON.stringify(childrenIds.filter(id => id !== child_id));
      });
      await Promise.all(events.map((event) => {
        const timeslotPatch = {
          extendedProperties: {
            shared: {
              children: event.extendedProperties.shared.children,
            },
          },
        };
        calendar.events.patch({ calendarId: calendar_id, eventId: event.id, resource: timeslotPatch });
      }));
      resolve('done');
    } catch (error) {
      reject(error);
    }
  });
});

module.exports = {
  unsubcribeChildFromGroupEvents,
  getNotificationDescription,
  getUsersGroupEvents,
};
