import mooz from '../base'

const log = require('core/log')('mooz/metronome/setPosition',
  false //(...args) => console.log(...args)
)

/**
 * Set position
 *
 * TODO: Other units
 *
 * @param {Object} props
 * @param {Number} props.bar  [description]
 * @param {Number} props.beat [description]
 */
export const setPosition = ({ bar, beat }, { state, actions, setState }) => {

  const { setPosition, getPosition } = actions

  //console.log('setPosition REQUEST', { bar, beat })

  /**
   * Handle beat underflow to previous bar
   *
   * tone.transport handles beat overflow to next bar
   */
  if (beat < 1) {
    if (bar > 1) {

      // Last beat of previous bar
      const beatsPerMeasure = state.timeSignature.beats

      beat = beatsPerMeasure
      bar--

      console.log('Last beat of previous bar', { beat, beatsPerMeasure })
    } else {
      beat = 1
    }
  }
  if (bar < 1) bar = 1


  /**
   * Internal bar/beat index starts at 0
   */
  const barIndex = bar-1

  /**
   * Convert beats based on time signature, because
   * tone.transport reduces unit to quarter note
   */
  const exactBeatIndex = (beat-1) / (state.timeSignature.unit / 4) // *
  const beatIndex = Math.floor(exactBeatIndex)

  const sixteenthIndex = (exactBeatIndex-beatIndex) * 4

  const newPos = `${barIndex}:${beatIndex}:${sixteenthIndex}`

  //console.log('setPosition AFTER', newPos)

  //newPos = mooz.time(newPos).toSeconds()

  mooz.transport.position = newPos

  mooz.emit('position')
  setState({ position: getPosition() })
}
