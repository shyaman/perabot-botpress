const setupGreetings = require('./features/greetings')
const contactDetails = require('./features/contactDetails')
const timeTable = require('./features/timeTable')


module.exports = function(bp) {
  bp.middlewares.load()
  setupGreetings(bp)
  contactDetails(bp)
  timeTable(bp)
}
