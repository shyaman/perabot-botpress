const _ = require('lodash');

module.exports = bp => {

  // when 'get_contact_information' intent trigger
    bp.hear({'nlp.metadata.intentName': 'get_contact_information'}, (event, next) => {

      const information_type = _.get(event, 'nlp.parameters.information_type')
      let person = _.get(event, 'nlp.parameters.person')


        bp.convo.start(event, convo => {
          const txt = txt => bp.messenger.createText(event.user.id, txt);

          if (person == '') {
            convo.threads['default'].addQuestion(txt('Whose contact details do you want?'), [
            {
              pattern: /(\d+)/i,
              callback: (response) => {
                person = response.match;
                console.log(person,'-person');
               convo.next();
              }
            },
            {
              default: true,
              callback: () => {

                console.log(person,'-masda');

                convo.say(txt('Tell me, whose contact details do you want?'))
                convo.repeat()
              }
            }
          ]);
          }

          console.log(person,'-inter');

        convo.on('done', () => {
          console.log(person,'-done');

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
        convo.on('aborted', () => { convo.say('OK. Is there anything else I could help you with?') })
        });

    })

    bp.hear({'nlp.metadata.intentName': 'get_contact_information_with_context'}, (event, next) => {

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
