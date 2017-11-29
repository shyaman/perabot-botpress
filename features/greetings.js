module.exports = bp => {
  bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {

    // using knex
    // const eventAttrs = { name: 'shyaman', email: 'shyaman321@gmail.com', telephone:'0717175405'}
    // bp.db.get().then(knex => knex('contacts').insert(eventAttrs))
    event.reply('#welcome') // See the file `content.yml` to see the block
    event.reply(event.nlp)
  })

  // You can also pass a matcher object to better filter events
  bp.hear({
    type: /message|text/i,
    text: /exit|bye|goodbye|quit|done|leave|stop/i
  }, (event, next) => {
    event.reply('#goodbye', {
      // You can pass data to the UMM bloc!
      reason: 'unknown'
    })
  })
}
