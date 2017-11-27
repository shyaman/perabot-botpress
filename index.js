const setupGreetings = require('./features/greetings')
const contactDetails = require('./features/contactDetails')

module.exports = function(bp) {
  setupGreetings(bp)
  contactDetails(bp)
}
