import { Emitter } from 'base/events'

const mooz = new Emitter

const isClient = typeof window!=='undefined'

const tone = isClient ? require('./tone') : null
const vex = isClient ? require('./vex/src')/*window.Vex*/ : null
const tuna = isClient ? require('./tuna')(tone.context) : null
const theory = require('./theory')

mooz.extend({

  vex, // Notation
  tone, // Scheduler
  context: !tone ? null : tone.context,
  transport: !tone ? null : tone.Transport,
  time: !tone ? null : tone.TransportTime,
  //volumeControl: !tone ? null : new tone.Volume(),
  tuna, // Audio effects
  theory, // Music theory

  // Loaded data types
  players: {},
  channels: {}, // Effects chain
  scores: {},
  sounds: {},
  midi: {},
  xml: {}
})

if (isClient) {

  // TODO: Check support for audio context

  require('./init/startAudioContext')(mooz.context).then(() => {

    // TODO: Set state prop or callback
    //console.log('Audio context started')
  })
}

module.exports = mooz