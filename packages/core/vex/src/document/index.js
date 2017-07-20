module.exports = function(Vex) {
  require('./measure')(Vex)
  require('./document')(Vex)
  require('./formatter')(Vex)
  require('./liquid')(Vex) // Must be after formatter
  return Vex
}