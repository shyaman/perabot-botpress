const jwtClient = require('../assets/jwtClient');
let google = require('googleapis');

//Google Calendar API
let calendar = google.calendar('v3');


calendar.events.list({
   auth: jwtClient,
   calendarId: 'primary'
}, function (err, response) {
   if (err) {
       console.log('The API returned an error: ' + err);
       return;
   }
   var events = response.items;
   if (events.length == 0) {
       console.log('No events found.');
   } else {
       console.log('Event from Google Calendar:');
       for (let event of response.items) {
           console.log('Event name: %s, Creator name: %s, Create date: %s', event.summary, event.creator.displayName, event.start.date);
       }
   }
});
