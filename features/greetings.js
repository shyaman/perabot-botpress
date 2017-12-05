module.exports = bp => {
  bp.hear({'nlp.metadata.intentName': 'Default Welcome Intent'}, (event, next) => {

    event.reply('#welcome') // See the file `content.yml` to see the block
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

  bp.hear(/stop|abort|cancel/i, (event, next) => {
      const convo = bp.convo.find(event)
      convo && convo.stop('aborted')
      })
}
