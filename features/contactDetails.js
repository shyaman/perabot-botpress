module.exports = bp => {
    bp.hear({'wit.entities.intent[0].value': 'get_contact_details'}, (event, next) => {
    console.log('>> get_contact_details')
    bp.messenger.sendText(event.user.id, 'get_contact_details intent')
  })
}