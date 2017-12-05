const _ = require('lodash');

module.exports = bp => {

  // when 'get_contact_information' intent trigger
    bp.hear({'nlp.metadata.intentName': 'get_contact_information'}, (event, next) => {

      const information_type = _.get(event, 'nlp.parameters.information_type')
      let person = _.get(event, 'nlp.parameters.person')


        bp.convo.start(event, convo => {
          if (person == '') {   //convo ask for the person
            convo.threads['default'].addQuestion('#askPerson', [
            {
              pattern: /(\w+\s+\w+)/i ,    //this is the pattern the person name should be given 'Firstname Lastname'
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
          ]);
          }

          //when conversation is done
        convo.on('done', () => {
          const splitName=person.split(" ")
          if(splitName.length >=2){
            bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', person.toLowerCase()))
            .then(contact =>{
              const email = _.get(contact[0],'email')
              const phoneNumber = _.get(contact[0],'telephone')

              if(contact.length != 0){
                if (information_type == '') {
                  if(email != '' && phoneNumber != ''){
                    event.reply('#contactReply',{
                      person:person,
                      email:email,
                      phoneNumber:phoneNumber
                    });
                  }else if(email != '' && phoneNumber == ''){
                    event.reply('#telErrorReply',{
                      person:person,
                      email:email
                    });
                  }else if(email == '' && phoneNumber != ''){
                    event.reply('#emailErrorReply',{
                      person:person,
                      phoneNumber:phoneNumber
                    });
                  }
                } else if (information_type == 'Email address') {
                  if(email != ''){
                    event.reply('#contactReplyDistinct',{
                      person:person,
                      information: email,
                      information_type:information_type
                    });
                  }else{
                    event.reply('#contactErrorReply',{
                      person:person,
                      information_type:information_type
                    });
                  }

                } else if (information_type == 'Phone number') {
                  if(phoneNumber != ''){
                    event.reply('#contactReplyDistinct',{
                      person:person,
                      information: phoneNumber,
                      information_type:information_type
                    });
                  }else{
                    event.reply('#contactErrorReply',{
                      person:person,
                      information_type:information_type
                    });
                  }

                }
              }else{
                bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', '%'+splitName[0].toLowerCase()+'%').select('name'))
                .then(suggestions =>{
                  var suggestedNames=[]
                  var res=""
                  for (var i = 0; i < suggestions.length; i++) {
                      suggestedNames.push(_.get(suggestions[i],'name'));
                  }
                  bp.convo.start(event, convo => {
                  if(suggestions.length ==1){
                    convo.threads['default'].addQuestion('#suggestNames',{suggestions:suggestedNames}, [
                      {
                        pattern: /(\w+)/i ,    //this is the pattern the person name should be given 'Firstname Lastname'
                        callback: (response) => {
                          person = response.match;
                          console.log(person);
                          convo.next();
                        }
                      },
                    {
                      pattern: utterances.no,
                      callback: () => {
                        const convo = bp.convo.find(event)
                        convo && convo.stop('aborted')
                      }
                    },
                    {
                      default: true,    //if its not in correct pattern, question repeat
                      callback: () => {
                        convo.repeat()
                      }
                    }
                  ]);
                  convo.on('done', () => {

                    if(res=="yes"){
                      bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', person.toLowerCase()))
                      .then(contact =>{
                        const email = _.get(contact[0],'email')
                        const phoneNumber = _.get(contact[0],'telephone')

                        if (information_type == '' || information_type =='Email Address and Phone Number') {
                          if(email != '' && phoneNumber != ''){
                            event.reply('#contactReply',{
                              person:person,
                              email:email,
                              phoneNumber:phoneNumber
                            });
                          }else if(email != '' && phoneNumber == ''){
                            event.reply('#telErrorReply',{
                              person:person,
                              email:email
                            });
                          }else if(email == '' && phoneNumber != ''){
                            event.reply('#emailErrorReply',{
                              person:person,
                              phoneNumber:phoneNumber
                            });
                          }
                        } else if (information_type == 'Email address') {
                          if(email != ''){
                            event.reply('#contactReplyDistinct',{
                              person:person,
                              information: email,
                              information_type:information_type
                            });
                          }else{
                            event.reply('#contactErrorReply',{
                              person:person,
                              information_type:information_type
                            });
                          }

                        } else if (information_type == 'Phone number') {
                          if(phoneNumber != ''){
                            event.reply('#contactReplyDistinct',{
                              person:person,
                              information: phoneNumber,
                              information_type:information_type
                            });
                          }else{
                            event.reply('#contactErrorReply',{
                              person:person,
                              information_type:information_type
                            });
                          }

                        }

                      })
                    }else{
                      event.reply('#sorry')
                    }
                  })
                  convo.on('aborted', () => { convo.say('OK. Is there anything else I could help you with?') })
                  
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
                });
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
  //trigger for context awareness
    bp.hear({'nlp.metadata.intentName': 'contact_information_with_contexts'}, (event, next) => {

      const information_type = _.get(event, 'nlp.parameters.information_type')
      let person = _.get(event, 'nlp.parameters.person')

      bp.db.get().then(knex => knex('contacts').whereRaw('LOWER(name) LIKE ?', person.toLowerCase()))
      .then(contact =>{
        const email = _.get(contact[0],'email')
        const phoneNumber = _.get(contact[0],'telephone')

        if (information_type == 'Email address') {
          event.reply('#contactReplyDistinct',{
            person:person,
            information: email,
            information_type:information_type
          });

        } else if (information_type == 'Phone number') {
          event.reply('#contactReplyDistinct',{
            person:person,
            information: phoneNumber,
            information_type:information_type
          });

        }
      })

  })

  //trigger for context awareness
  bp.hear({'nlp.metadata.intentName': 'contact_information_with_contexts'}, (event, next) => {

    const information_type = _.get(event, 'nlp.parameters.information_type')
    let person = _.get(event, 'nlp.parameters.person')

    bp.db.get().then(knex => knex('contacts').where({name : person}))
    .then(contact =>{
      const email = _.get(contact[0],'email')
      const phoneNumber = _.get(contact[0],'telephone')

      if (information_type == 'Email address') {
        event.reply('#contactReplyDistinct',{
          person:person,
          information: email,
          information_type:information_type
        });

      } else if (information_type == 'Phone number') {
        event.reply('#contactReplyDistinct',{
          person:person,
          information: phoneNumber,
          information_type:information_type
        });

      }
    })

})

}
