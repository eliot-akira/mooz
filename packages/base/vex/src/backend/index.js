module.exports = function(Vex) {
  require('./json')(Vex)
  require('./musicxml')(Vex)
  return Vex
}