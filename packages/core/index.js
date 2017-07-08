import mooz from './mooz'

mooz.extend({
  ...require('./status'),
  ...require('./transport'),
  ...require('./player'),
  ...require('./load'),
  ...require('./metronome'),
})

mooz.metronome.init()

module.exports = mooz