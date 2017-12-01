const _ = require('lodash');

module.exports = bp => {

  // when 'get_contact_information' intent trigger
    bp.hear({'nlp.metadata.intentName': 'get_contact_information'}, (event, next) => {

      const information_type = _.get(event, 'nlp.parameters.information_type')
      let person = _.get(event, 'nlp.parameters.person')


        bp.convo.start(event, convo => {
          if (person == '') {   //convo ask for the person
            convo.threads['default'].addQuestion('Whose contact details do you want?', [
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
              event.reply('#contactReply',{
                person:person,
                email:email,
                phoneNumber:phoneNumber
              });
            } else if (information_type == 'Email address') {
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
        //if its abort 
        convo.on('aborted', () => { convo.say('OK. Is there anything else I could help you with?') })
        });

  })
}
