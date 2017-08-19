import { midiToNoteName } from 'mooz/util/midi'

const log = require('base/log')('mooz/midi/createPlayerData',
  false, //(...args) => console.log(...args)
)

const secondsToBeats = (sec, bpm) => sec * (bpm/60) // Beats per second

const secondsToRelativeBeat = (sec, bpm) => '4n * '+secondsToBeats(sec, bpm)


function midiNoteToEvent({ midiNote, bpm }) {

  const { time, duration, midi } = midiNote
  const note = midiToNoteName(midi)

  const relativeDuration = secondsToRelativeBeat(duration, bpm)
  const relativeTime = secondsToRelativeBeat(time, bpm)

  //console.log('TO BEAT', note, { time, relativeTime, duration, relativeDuration })

  return {
    ...midiNote,
    note,
    time: relativeTime,
    duration: relativeDuration,
  }
}

export default function createPlayerData(data) {

  const { header, tracks, ...otherProps } = data

  const {
    bpm = 120,
    timeSignature = [4, 4]
  } = header

  const schedule = tracks[0].notes.map(midiNote => midiNoteToEvent({ midiNote, bpm }))

  // Loop duration

  // TODO: Get full length of MIDI file, not last note

  const loopEnd = '4n * '+(
    // Round it up to end of measure
    Math.ceil(secondsToBeats(tracks[0].duration, bpm) / timeSignature[0])
    * timeSignature[0]
  )

  const p = {
    schedule,
    loop: true,
    loopEnd,
    ...otherProps
  }

  log('MIDI player data', p, { header, tracks })

  return p
}
