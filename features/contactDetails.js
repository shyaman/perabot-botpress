module.exports = bp => {
    bp.hear({'wit.entities.intent[0].value': 'get_contact_details'}, (event, next) => {
    console.log('>> get_contact_details')
    event.reply('#goodbye', {
      // You can pass data to the UMM bloc!
      info: 'wit.entities.intent[0].value'
    })
  })
}
