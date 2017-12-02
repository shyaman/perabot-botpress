const jwtClient = require('../assets/jwtClient');
let google = require('googleapis');
const _ = require('lodash');

//Google Calendar API
let calendar = google.calendar('v3');

module.exports = bp =>{
  bp.hear({'nlp.metadata.intentName': 'get_timetable_next'}, (event, next) =>{
    calendar.events.list({
      auth: jwtClient,
      calendarId: 'mhu2j2t8ar0vea03t7orsmrbts@group.calendar.google.com',
      timeMin: (new Date()).toISOString(),
      timeMax:(new Date(new Date().getTime()+1000*60*60*24)).toISOString(),
      maxResults: 2,
      singleEvents: true,
      orderBy: 'startTime'
    },  (err, response) => {
       if (err) {
           console.log('The API returned an error: ' + err);
           return;
       }
       var calEvents = response.items;
       if (calEvents.length == 0) {
           event.reply('#noSubject')
       } else {
           const curTime = new Date();
           for (let calEvent of response.items) {
               let eventTime = new Date(calEvent.start.dateTime);
               diff  = eventTime - curTime;
               if (diff>0) {
                  console.log(diff,calEvent.summary);
                  const nextSubject = _.get(calEvent,'summary');
                  event.reply('#nextSubject',{
                    subject : nextSubject,
                    time : eventTime.toLocaleTimeString()
                  })
                  break;
               }
           }
           event.reply('#noSubject')
       }
    });
  })
}
