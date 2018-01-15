const _ = require('lodash');
const mailer = require('../assets/mailer')
const jwtClient = require('../assets/jwtClient');
let google = require('googleapis');

let calendar = google.calendar('v3');

module.exports = bp => {

  bp.hear({'nlp.metadata.intentName': 'make_appointment'}, (event, next) => {

    let person = _.get(event, 'nlp.parameters.person')
    const getDate = _.get(event, 'nlp.parameters.date')
    const getTime = _.get(event, 'nlp.parameters.time')

    bp.convo.start(event, convo => {
      if (person == '') {   //convo ask for the person
        convo.threads['default'].addQuestion(bp.messenger.createText(event.user.id,'with whom?', [
          {
            pattern: /(\w+\s+\w+)/i,    //this is the pattern the person name should be given 'Firstname Lastname'
            callback: (response) => {
              person = response.match;
              console.log(person);
              convo.next();
            }
          },
          {
            default: true,    //if its not in correct pattern, question repeat
            callback: () => {
              convo.repeat()
            }
          }
        ])
      )
      }

      //when conversation is done
      convo.on('done', () => {
        const splitName=person.split(" ")
        if(splitName.length >=2){
          bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', person.toLowerCase()))
          .then(contact =>{

            if(contact.length != 0){
              const regNum = _.get(contact[0],'regNum');
              const email = _.get(contact[0],'email');

              bp.db.get().then(knex => knex('calendarDetails').where({teacherId:regNum}))
              .then(calendarEntry =>{
                const calendarId = _.get(calendarEntry[0],'calendarId')
                const splitedDate = getDate.split("-")
                const splitedTime = getTime.split(":")
                const date =new Date(new Date(new Date().setFullYear(splitedDate[0],splitedDate[1]-1,splitedDate[2])).setHours(splitedTime[0],splitedTime[1],splitedTime[2]))
                const calDate = Object.assign({},date)
                calendar.events.list({
                  auth: jwtClient,
                  calendarId: calendarId,
                  timeMin: date.toISOString(),
                  timeMax:(new Date(date.setHours(18,1,0))).toISOString(),
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
                       convo.say(bp.messenger.createText(event.user.id,'The time slot is free.'))
                       bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id}))
                       .then(querry =>{
                         const eNum = _.get(querry[0],'regNum');
                         const stuEmail = _.get(querry[0],'emailAddress');
                         const message = "Sir/Madam,\n\nThe student "+eNum+" asked to make an appointment to meet you on "+ getDate + " at " +getTime +"\n\nFor further details you can contact that student via "+ stuEmail +"\n\nThank you!"
                         mailer(message,email,'Making an appointment');
                         convo.say(bp.messenger.createText(event.user.id,'I sent a mail to Dr. '+person+' asking an appointment'))

                       })
                   } else {
                     let sub = response.items[0]
                     let eventStartTime = new Date(sub.start.dateTime);
                     if ((calDate - eventStartTime)>0){
                       convo.say(bp.messenger.createText(event.user.id,'There is no free time slot at ' + getTime))
                     }else {
                       convo.say(bp.messenger.createText(event.user.id,'There is a free time slot from '+ getTime + ' to ' + eventStartTime.toLocaleTimeString()))
                       bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id}))
                       .then(querry =>{
                         const eNum = _.get(querry[0],'regNum');
                         const stuEmail = _.get(querry[0],'emailAddress');
                         const message = "Sir/Madam,\n\nThe student "+eNum+" asked to make an appointment to meet you on "+ getDate + " at " +getTime +"\n\nFor further details you can contact that student via "+ stuEmail +"\n\nThank you!"
                         mailer(message,email,'Making an appointment');
                         convo.say(bp.messenger.createText(event.user.id,'I sent a mail to Dr. '+person+' asking an appointment'))

                       })
                     }

                   }
                });
              })
            }else{
              bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', '%'+splitName[0].toLowerCase()+'%').select('name'))
              .then(suggestions =>{
                var suggestedNames=[]
                for (var i = 0; i < suggestions.length; i++) {
                  suggestedNames.push(_.get(suggestions[i],'name'));
                }
                if(suggestions.length !=0){
                  event.reply('#suggestNames',{
                    suggestions:suggestedNames
                  })
                }else{
                  bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+splitName[1].toLowerCase()+'%').select('name'))
                  .then(suggestions =>{
                    var suggestedNames=[]
                    for (var i = 0; i < suggestions.length; i++) {
                      suggestedNames.push(_.get(suggestions[i],'name'));
                    }
                    if(suggestions.length != 0){
                      event.reply('#suggestNames',{
                        suggestions:suggestedNames
                      })
                    }else{
                      bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?',splitName[0][0].toLowerCase()+'%'+' '+'%').select('name'))
                      .then(suggestions =>{
                        var suggestedNames=[]
                        for (var i = 0; i < suggestions.length; i++) {
                          suggestedNames.push(_.get(suggestions[i],'name'));
                        }
                        if(suggestions.length !=0){
                          event.reply('#suggestNames',{
                            suggestions:suggestedNames
                          })
                        }else{
                          bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+' '+splitName[1][0].toLowerCase()+'%').select('name'))
                          .then(suggestions =>{
                            var suggestedNames=[]
                            for (var i = 0; i < suggestions.length; i++) {
                              suggestedNames.push(_.get(suggestions[i],'name'));
                            }
                            if(suggestions.length !=0){
                              event.reply('#suggestNames',{
                                suggestions:suggestedNames
                              })
                            }else{
                              event.reply('#error',{
                                person:person
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }else{
          bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+person.toLowerCase()+'%').select('name'))
          .then(suggestions =>{
            var suggestedNames=[]
            for (var i = 0; i < suggestions.length; i++) {
              suggestedNames.push(_.get(suggestions[i],'name'));
            }
            if(suggestions.length !=0){
              event.reply('#suggestNames',{
                suggestions:suggestedNames
              });
            }else{
              bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?',person[0].toLowerCase()+'%'+' '+'%').select('name'))
              .then(suggestions =>{
                var suggestedNames=[]
                for (var i = 0; i < suggestions.length; i++) {
                  suggestedNames.push(_.get(suggestions[i],'name'));
                }
                if(suggestions.length !=0){
                  event.reply('#suggestNames',{
                    suggestions:suggestedNames
                  })
                }else{
                  bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+' '+person[0].toLowerCase()+'%').select('name'))
                  .then(suggestions =>{
                    var suggestedNames=[]
                    for(var i=0;i<suggestions.length;i++){
                      suggestedNames.push(_.get(suggestions[i],'name'))
                    }
                    if(suggestions.length !=0){
                      event.reply('#suggestNames',{
                        suggestions:suggestedNames
                      })
                    }else{
                      event.reply('#error',{
                        person:person
                      })
                    }
                  })
                }
              })
            }

          })
        }
      })
      //if its abort
      convo.on('aborted', () => { convo.say('OK. Is there anything else I could help you with?') })
    });
  })

  bp.hear({'nlp.metadata.intentName': 'makeAppointmnet_withContext'}, (event, next) => {

    let person = _.get(event, 'nlp.parameters.person')
    const getDate = _.get(event, 'nlp.parameters.date')
    const getTime = _.get(event, 'nlp.parameters.time')

    bp.convo.start(event, convo => {
      if (person == '') {   //convo ask for the person
        convo.threads['default'].addQuestion(bp.messenger.createText(event.user.id,'with whom?', [
          {
            pattern: /(\w+\s+\w+)/i,    //this is the pattern the person name should be given 'Firstname Lastname'
            callback: (response) => {
              person = response.match;
              console.log(person);
              convo.next();
            }
          },
          {
            default: true,    //if its not in correct pattern, question repeat
            callback: () => {
              convo.repeat()
            }
          }
        ])
      )
      }

      //when conversation is done
      convo.on('done', () => {
        const splitName=person.split(" ")
        if(splitName.length >=2){
          bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', person.toLowerCase()))
          .then(contact =>{

            if(contact.length != 0){
              const regNum = _.get(contact[0],'regNum');
              const email = _.get(contact[0],'email');

              bp.db.get().then(knex => knex('calendarDetails').where({teacherId:regNum}))
              .then(calendarEntry =>{
                const calendarId = _.get(calendarEntry[0],'calendarId')
                const splitedDate = getDate.split("-")
                const splitedTime = getTime.split(":")
                const date =new Date(new Date(new Date().setFullYear(splitedDate[0],splitedDate[1]-1,splitedDate[2])).setHours(splitedTime[0],splitedTime[1],splitedTime[2]))
                const calDate = Object.assign({},date)
                calendar.events.list({
                  auth: jwtClient,
                  calendarId: calendarId,
                  timeMin: date.toISOString(),
                  timeMax:(new Date(date.setHours(18,1,0))).toISOString(),
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
                       convo.say(bp.messenger.createText(event.user.id,'The time slot is free.'))
                       bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id}))
                       .then(querry =>{
                         const eNum = _.get(querry[0],'regNum');
                         const stuEmail = _.get(querry[0],'emailAddress');
                         const message = "Sir/Madam,\n\nThe student "+eNum+" asked to make an appointment to meet you on "+ getDate + " at " +getTime +"\n\nFor further details you can contact that student via "+ stuEmail +"\n\nThank you!"
                         mailer(message,email,'Making an appointment');
                         convo.say(bp.messenger.createText(event.user.id,'I sent a mail to Dr. '+person+' asking an appointment'))

                       })
                   } else {
                     let sub = response.items[0]
                     let eventStartTime = new Date(sub.start.dateTime);
                     if ((calDate - eventStartTime)>0){
                       convo.say(bp.messenger.createText(event.user.id,'There is no free time slot at ' + getTime))
                     }else {
                       convo.say(bp.messenger.createText(event.user.id,'There is a free time slot from '+ getTime + ' to ' + eventStartTime.toLocaleTimeString()))
                       bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id}))
                       .then(querry =>{
                         const eNum = _.get(querry[0],'regNum');
                         const stuEmail = _.get(querry[0],'emailAddress');
                         const message = "Sir/Madam,\n\nThe student "+eNum+" asked to make an appointment to meet you on "+ getDate + " at " +getTime +"\n\nFor further details you can contact that student via "+ stuEmail +"\n\nThank you!"
                         mailer(message,email,'Making an appointment');
                         convo.say(bp.messenger.createText(event.user.id,'I sent a mail to Dr. '+person+' asking an appointment'))

                       })
                     }

                   }
                });
              })
            }else{
              bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', '%'+splitName[0].toLowerCase()+'%').select('name'))
              .then(suggestions =>{
                var suggestedNames=[]
                for (var i = 0; i < suggestions.length; i++) {
                  suggestedNames.push(_.get(suggestions[i],'name'));
                }
                if(suggestions.length !=0){
                  event.reply('#suggestNames',{
                    suggestions:suggestedNames
                  })
                }else{
                  bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+splitName[1].toLowerCase()+'%').select('name'))
                  .then(suggestions =>{
                    var suggestedNames=[]
                    for (var i = 0; i < suggestions.length; i++) {
                      suggestedNames.push(_.get(suggestions[i],'name'));
                    }
                    if(suggestions.length != 0){
                      event.reply('#suggestNames',{
                        suggestions:suggestedNames
                      })
                    }else{
                      bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?',splitName[0][0].toLowerCase()+'%'+' '+'%').select('name'))
                      .then(suggestions =>{
                        var suggestedNames=[]
                        for (var i = 0; i < suggestions.length; i++) {
                          suggestedNames.push(_.get(suggestions[i],'name'));
                        }
                        if(suggestions.length !=0){
                          event.reply('#suggestNames',{
                            suggestions:suggestedNames
                          })
                        }else{
                          bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+' '+splitName[1][0].toLowerCase()+'%').select('name'))
                          .then(suggestions =>{
                            var suggestedNames=[]
                            for (var i = 0; i < suggestions.length; i++) {
                              suggestedNames.push(_.get(suggestions[i],'name'));
                            }
                            if(suggestions.length !=0){
                              event.reply('#suggestNames',{
                                suggestions:suggestedNames
                              })
                            }else{
                              event.reply('#error',{
                                person:person
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }else{
          bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+person.toLowerCase()+'%').select('name'))
          .then(suggestions =>{
            var suggestedNames=[]
            for (var i = 0; i < suggestions.length; i++) {
              suggestedNames.push(_.get(suggestions[i],'name'));
            }
            if(suggestions.length !=0){
              event.reply('#suggestNames',{
                suggestions:suggestedNames
              });
            }else{
              bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?',person[0].toLowerCase()+'%'+' '+'%').select('name'))
              .then(suggestions =>{
                var suggestedNames=[]
                for (var i = 0; i < suggestions.length; i++) {
                  suggestedNames.push(_.get(suggestions[i],'name'));
                }
                if(suggestions.length !=0){
                  event.reply('#suggestNames',{
                    suggestions:suggestedNames
                  })
                }else{
                  bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?','%'+' '+person[0].toLowerCase()+'%').select('name'))
                  .then(suggestions =>{
                    var suggestedNames=[]
                    for(var i=0;i<suggestions.length;i++){
                      suggestedNames.push(_.get(suggestions[i],'name'))
                    }
                    if(suggestions.length !=0){
                      event.reply('#suggestNames',{
                        suggestions:suggestedNames
                      })
                    }else{
                      event.reply('#error',{
                        person:person
                      })
                    }
                  })
                }
              })
            }

          })
        }
      })
      //if its abort
      convo.on('aborted', () => { convo.say('OK. Is there anything else I could help you with?') })
    });
  })

}
