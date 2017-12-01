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
          ]);
          }

          //when conversation is done
        convo.on('done', () => {

          bp.db.get().then(knex => knex('contacts').where({name : person}))
          .then(contact =>{
            const email = _.get(contact[0],'email')
            const phoneNumber = _.get(contact[0],'telephone')


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
          })
        })
        //if its abort
        convo.on('aborted', () => { convo.say('OK. Is there anything else I could help you with?') })
        });
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
