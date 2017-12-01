const setupGreetings = require('./features/greetings')
const contactDetails = require('./features/contactDetails')

module.exports = function(bp) {
  bp.middlewares.load()
  setupGreetings(bp)
  contactDetails(bp)
}
