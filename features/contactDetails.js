const _ = require('lodash');

module.exports = bp => {
  // when 'get_contact_information' intent trigger
    bp.hear({'nlp.metadata.intentName': 'get_contact_information'}, (event, next) => {

      let information_type = _.get(event, 'nlp.parameters.information_type')
      let person = _.get(event, 'nlp.parameters.person')

      bp.db.get().then(knex => knex('contacts').where({name : person}))
      .then(contact =>{
        const email = _.get(contact[0],'email')
        const phoneNumber = _.get(contact[0],'telephone')

        event.reply('#contactReply',{
          person:person,
          information_type:information_type,
          email:email,
          phoneNumber:phoneNumber
        });
      })

  })
}
