import { Emitter } from 'core/events'

const mooz = new Emitter

const isClient = typeof window!=='undefined'
const tone = isClient ? require('./tone') : {}
const vex = isClient ? window.Vex : {}

mooz.extend({
  tone,
  context: tone.context, // TODO: Check support for audio context
  transport: tone.Transport,
  time: tone.TransportTime,
  players: {
    //name: player
  },
  sounds: {
    // name: buffers
  },
  vex
})

if (isClient) {
  window.mooz = mooz
  require('./init/startAudioContext')(mooz.context).then(() => {
    console.log('Audio context started')
  })
}

module.exports = mooz