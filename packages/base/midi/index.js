import mooz from '../base'
import * as midiConvert from './midiConvert'
import createPlayerData from './createPlayerData'

const log = require('base/log')('mooz/midi',
  (...args) => console.log(...args)
)

export function loadMidi({ src, player, scoreName }, { setState, actions }) {

  return new Promise((resolve, reject) => {

    const done = midi => {

      if (scoreName) mooz.scores[scoreName].midi.push(midi)
      //if (player) actions.load({ [player]: midi })

      resolve(midi)
    }

    const cached = mooz.midi[src]

    if (cached) {
      if (cached.wait) cached.wait.push(done)
      else done(cached)
      return
    }

    mooz.midi[src] = { wait: [] }

    try {

      midiConvert.load(src)

      .then((data) => {

        const midi = createPlayerData({ ...data, src, player })

        log.ok('MIDI to schedule', src, {
          data,
          midi
        })

        // Callbacks waiting
        mooz.midi[src].wait.forEach(p => p(midi))

        mooz.midi[src] = midi

        done(midi)
      })

    } catch (e) {
      console.error(e)
    }
  })
}
