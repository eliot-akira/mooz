let coords = require('./notecoord')
let accval = require('./accidentalValue')

module.exports = function helmholtz(str) {

  const name = str.replace(/\u2032/g, "'").replace(/\u0375/g, ',')
  let parts = name.match(/^(,*)([a-h])(x|#|bb|b?)([,\']*)$/i)

  if (!parts || name !== parts[0])
    throw new Error('Invalid formatting')

  let note = parts[2]
  let octaveFirst = parts[1]
  let octaveLast = parts[4]
  let lower = note === note.toLowerCase()
  let octave

  if (octaveFirst) {
    if (lower)
      throw new Error('Invalid formatting - found commas before lowercase note')

    octave = 2 - octaveFirst.length
  } else if (octaveLast) {
    if (octaveLast.match(/^'+$/) && lower)
      octave = 3 + octaveLast.length
    else if (octaveLast.match(/^,+$/) && !lower)
      octave = 2 - octaveLast.length
    else
      throw new Error('Invalid formatting - mismatch between octave ' +
        'indicator and letter case')
  } else
    octave = lower ? 3 : 2

  let accidentalValue = accval.interval(parts[3].toLowerCase())
  let coord = coords(note.toLowerCase())

  coord[0] += octave
  coord[0] += accidentalValue[0] - coords.A4[0]
  coord[1] += accidentalValue[1] - coords.A4[1]

  return coord
}