module.exports = function(Vex) {
  require('./measure')(Vex)
  require('./part')(Vex)
  require('./voice')(Vex)
  require('./stave')(Vex)
  require('./note')(Vex)
}
