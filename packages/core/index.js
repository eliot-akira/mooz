import mooz from './mooz'
import vex from './vex/src'

mooz.extend({
  ...require('./status'),
  ...require('./transport'),
  ...require('./player'),
  ...require('./load'),
  ...require('./metronome'),
  vex
})

mooz.metronome.init()

module.exports = mooz