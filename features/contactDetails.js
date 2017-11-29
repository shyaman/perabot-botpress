module.exports = bp => {
  bp.hear(/.+/i, (event, next)=> {
    console.log(event.nlp)
  })
}
