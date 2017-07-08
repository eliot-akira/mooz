import mooz from '../mooz'

mooz.extend({
  metronome: new mooz.Emitter()
})

const log = require('core/log')('mooz/sounds/metronome', (...args) => console.log(...args))

mooz.metronome.init = () => {

  mooz.load({
    metronome: {

      // Let user load their own
      //sounds: '/static/mooz/instruments/metronome.json',

      // TODO: Based on time signature

      schedule: [
        { time: '0', note: 'high' },
        { time: '4n', note: 'low' },
        { time: '4n * 2', note: 'low' },
        { time: '4n * 3', note: 'low' },
      ],

      volume: 0.6,
      mute: false,
      loop: true,
      loopEnd: '1m', // Every measure
      callback: ({ event, position, player }) => {
        // Events on the root object as a shortcut
        mooz.emit('beat', position)
      }
    }
  })
  .then(player => {
    mooz.metronome.player = player
  })
}
