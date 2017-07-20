import mooz from '../base'
import { playerOffset } from '../constants'

const log = require('core/log')('mooz/metronome/getPosition',
  false //(...args) => console.log(...args)
)

export const getPosition = (props = {}, { state, setState }) => {

  let seconds = mooz.transport.seconds

  if (state.isPlaying) {
    // Subtract offset for correct position
    if (seconds < playerOffset) seconds = 0
    else seconds -= playerOffset
  }

  const pos = mooz.time(seconds).toBarsBeatsSixteenths()
  const realPos = mooz.transport.position

  if (state.isPlaying) log.warn('getPosition ADJUST', { pos, realPos })

  let [
    barIndex, beatIndex, sixteenthIndex
  ] = pos.split(':').map(i => parseInt(i, 10))


  log.ok('getPosition INTERNAL', { barIndex, beatIndex, sixteenthIndex, seconds })

  beatIndex += sixteenthIndex / 4 // Combine sixteenth

  /**
   * Convert beats based on time signature, because
   * tone.transport reduces unit to quarter note
   */
  beatIndex = beatIndex * (state.timeSignature.unit / 4)

  /**
   * Internal bar/beat index starts at 0
   */
  const bar = barIndex+1
  const exactBeat = beatIndex+1

  // Reduce beat count to whole numbers
  const beat = Math.floor(exactBeat)
  const fraction = exactBeat - beat

  log.ok('getPosition PUBLIC', { bar, beat, fraction, seconds })

  /**
   * Total beat index
   *
   * TODO: To handle tempo change, calculate beat index from bars, then beats
   */
  const bpm = mooz.transport.bpm.value
  const totalBeatIndex = seconds * (bpm / 60) // 60 BPM: 1 sec = 1 beat

  //const progress = mooz.transport.progress // 0~1 with loop
  //const ticks = mooz.transport.ticks

  return {
    bpm,
    totalBeatIndex,
    bar, beat, fraction,
    //sixteenth,
    //seconds, progress,
    //ticks,
    // time signature
  }
}
