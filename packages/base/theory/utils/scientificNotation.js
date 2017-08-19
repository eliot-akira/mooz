let coords = require('./notecoord')
let accval = require('./accidentalValue')

module.exports = function scientific(name) {
  let format = /^([a-h])(x|#|bb|b?)(-?\d*)/i

  let parser = name.match(format)
  if (!(parser && name === parser[0] && parser[3].length)) return

  let noteName = parser[1]
  let octave = +parser[3]
  let accidental = parser[2].length ? parser[2].toLowerCase() : ''

  let accidentalValue = accval.interval(accidental)
  let coord = coords(noteName.toLowerCase())

  coord[0] += octave
  coord[0] += accidentalValue[0] - coords.A4[0]
  coord[1] += accidentalValue[1] - coords.A4[1]

  return coord
}