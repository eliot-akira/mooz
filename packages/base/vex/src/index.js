const Vex = require('./core')

require('./backend')(Vex)
require('./document')(Vex) // Must be after backend
//require('./score')(Vex)

module.exports = Vex