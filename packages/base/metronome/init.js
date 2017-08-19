import mooz from '../base'
import { latencyHint } from '../constants'

const log = require('base/log')('mooz/metronome/init',
  (...args) => console.log(...args)
)

export function initMetronome(props, { state, actions }) {

  mooz.transport.latencyHint = latencyHint // TODO: Make this adjustable

  actions.setTempo(state.tempo)

  return actions.load({
    metronome: {

      // Let user load their own
      //sounds: '/static/mooz/instruments/metronome.json',

      schedule: createMetronomeSchedule(state.timeSignature)
      /*[
        { time: '0', note: 'high' },
        { time: '4n', note: 'low' },
        { time: '4n * 2', note: 'low' },
        { time: '4n * 3', note: 'low' },
      ]*/,

      volume: 0.6,
      mute: false,
      loop: true,
      loopEnd: '1m', // Every measure
      callback: ({ event, position, player }) => {
        // Events on the root object as a shortcut
        mooz.emit('metronome', position)
      }
    }
  })
  .then(() => {

    const broadcast = (key) => {
      const pos = actions.getPosition()

      //log.ok(`Metronome ${key}`, pos)

      mooz.emit('metronome', pos)
    }

    mooz.on('start', () => broadcast('start'))
    mooz.on('pause', () => broadcast('pause'))
    mooz.on('stop', () => broadcast('stop'))
    mooz.on('position', () => broadcast('position'))
    mooz.on('timeSignature', (timeSignature) => {

      const schedule = createMetronomeSchedule(timeSignature)

      mooz.players.metronome.setSchedule(schedule)

    })
  })
}

function createMetronomeSchedule(timeSignature) {

  const { beats, unit } = timeSignature
  const schedule = []

  for (let i = 0; i < beats; i++) {
    schedule.push({
      time: `${unit}n * ${i}`,
      note: i===0 ? 'high' : (
        unit===4 ? 'low' : (
          i%3===0 ? 'mid' : 'low'
        )
      )
    })
  }

  //console.log('createMetronomeSchedule', schedule)
  return schedule
}
