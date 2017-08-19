module.exports = function(Vex) {
  require('./document')(Vex)
  require('./formatter')(Vex)
  require('./measure')(Vex)
}