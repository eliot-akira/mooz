module.exports = function(Vex) {
  require('./measure')(Vex)
  require('./musicxml')(Vex)
  require('./document')(Vex)
  require('./documentformatter')(Vex)
  return Vex
}