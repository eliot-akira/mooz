import mooz from './mooz'

// Issue with Next.js build pipeline
// https://github.com/zeit/next.js/issues/2531
import vex from './vex/src'
import './test'

mooz.extend({
  ...require('./status'),
  ...require('./transport'),
  ...require('./player'),
  ...require('./load'),
  ...require('./metronome'),
  vex: typeof window!=='undefined' ? window.Vex : null
})

mooz.metronome.init()

module.exports = mooz