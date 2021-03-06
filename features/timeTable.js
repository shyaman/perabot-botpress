const jwtClient = require('../assets/jwtClient');
let google = require('googleapis');
const _ = require('lodash');

//Google Calendar API
let calendar = google.calendar('v3');

const selectcalendar = (userId,bp) =>{
  bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id})).then(person =>{
    const department = _.get(person[0],'department');
    const batch = (_.get(person[0],'regNum').split("/"))[1];
    bp.db.get().then(knex => knex('calendarDetails').where({batch:batch,department:department})).then(calendarEntry =>{
      calendarId = _.get(calendarEntry[0],'calendarId');

    })
  })
}

module.exports = bp =>{
  bp.hear({'nlp.metadata.intentName': 'get_timetable_next'}, (event, next) =>{

    bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id})).then(person =>{
      const department = _.get(person[0],'department');
      const batch = (_.get(person[0],'regNum').split("/"))[1];
      bp.db.get().then(knex => knex('calendarDetails').where({batch:batch,department:department})).then(calendarEntry =>{
        calendarId = _.get(calendarEntry[0],'calendarId');
  calendar.events.list({
    auth: jwtClient,
    calendarId: calendarId,
    timeMin: (new Date()).toISOString(),
    timeMax:(new Date(new Date().setHours(18,1,0))).toISOString(),
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
         let found = 0;
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
                found = 1;
                break;
             }
         }
         if (found == 0) {
           event.reply('#noSubject')
         }
     }
  });
      })
    })


  })

  bp.hear({'nlp.metadata.intentName': 'get_timetable_daily'}, (event, next) =>{

    bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id})).then(person =>{
      const department = _.get(person[0],'department');
      const batch = ((_.get(person[0],'regNum')).split("/"))[1];
      bp.db.get().then(knex => knex('calendarDetails').where({batch:batch,department:department})).then(calendarEntry =>{
        calendarId = _.get(calendarEntry[0],'calendarId');
  const getDate = _.get(event, 'nlp.parameters.date')
  const splitedDate = getDate.split("-")
  const date = new Date(new Date().setFullYear(splitedDate[0],splitedDate[1]-1,splitedDate[2]))

  calendar.events.list({
    auth: jwtClient,
    calendarId: calendarId,
    timeMin: (new Date(date.setHours(8,0,0))).toISOString(),
    timeMax:(new Date(date.setHours(18,1,0))).toISOString(),
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
             event.reply('#dailyTimetable',{
               subject:_.get(calEvent,'summary'),
               startTime:new Date(calEvent.start.dateTime).toLocaleTimeString(),
               endTime:new Date(calEvent.end.dateTime).toLocaleTimeString()
             })
         }
     }
  });
      })
    })


  })

  bp.hear({'nlp.metadata.intentName': 'get_timetable_next_with_content'}, (event, next) =>{

    bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id})).then(person =>{
      const department = _.get(person[0],'department');
      const batch = (_.get(person[0],'regNum').split("/"))[1];
      bp.db.get().then(knex => knex('calendarDetails').where({batch:batch,department:department})).then(calendarEntry =>{
        calendarId = _.get(calendarEntry[0],'calendarId');
      calendar.events.list({
        auth: jwtClient,
        calendarId: calendarId,
        timeMin: (new Date()).toISOString(),
        timeMax:(new Date(new Date().setHours(18,1,0))).toISOString(),
        maxResults: 5,
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
             let found = 0;
             for (let calEvent of response.items) {
                 let eventTime = new Date(calEvent.start.dateTime);
                 diff  = eventTime - curTime;
                 if (diff>0) {
                    found = found + 1;
                    if(found == 2){
                        console.log(diff,calEvent.summary);
                        const nextSubject = _.get(calEvent,'summary');
                        event.reply('#nextSubject',{
                          subject : nextSubject,
                          time : eventTime.toLocaleTimeString()
                        })
                        break;
                    }
                  }
             }
             if (found == 0 || found == 1) {
               event.reply('#noSubject')
             }
         }
        });
        })
    })


  })


  bp.hear({'nlp.metadata.intentName': 'get_timetable_subject_given'}, (event, next) =>{

    bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id})).then(person =>{
      const department = _.get(person[0],'department');
      const batch = (_.get(person[0],'regNum').split("/"))[1];
      bp.db.get().then(knex => knex('calendarDetails').where({batch:batch,department:department})).then(calendarEntry =>{
        calendarId = _.get(calendarEntry[0],'calendarId');

      let mydate = _.get(event, 'nlp.parameters.date')
      let subject = _.get(event, 'nlp.parameters.subject').trim()


      calendar.events.list({
        auth: jwtClient,
        calendarId: 'mhu2j2t8ar0vea03t7orsmrbts@group.calendar.google.com',
        timeMin: (new Date(new Date(mydate).setHours(7,30,0))).toISOString(),
        timeMax:(new Date(new Date(mydate).setHours(18,30,0))).toISOString(),
        maxResults: 10,
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
             var flag = 0;
             for (let sub of response.items) {
                 let eventStartTime = new Date(sub.start.dateTime);
                 let eventEndTime = new Date(sub.end.dateTime);

                 let code = _.get(sub,'summary')
                 // Trim the subject code part
                 let subcode = code.substr(0,5)
                 // Compare subjects
                 if (subcode==subject) {
                   flag = 1;
                   event.reply('#subjectTime',{
                      subjectCode : subject,
                      starting : eventStartTime.toLocaleTimeString(),
                      ending : eventEndTime.toLocaleTimeString()
                   })
                 }

             }
             if(flag==0){
               event.reply('#noLectures',{
                 subject : subject
               })
             }
         }
      })
      })
    })

 })

}
