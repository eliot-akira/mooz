import mooz from '../base'

/**
 * Time signature
 *
 * @param {Number} beats
 * @param {Number} unit
 */
export function setTimeSignature(props, { state, setState, actions }) {

  let beats, unit

  if (typeof props==='string') {
    [beats, unit] = props.split('/')
  } else {
    beats = props.beats
    unit = props.unit
  }

  const timeSignature = {
    beats: parseInt(beats, 10),
    unit: parseInt(unit, 10),
  }

  console.log('setTimeSignature', timeSignature)

  //actions.pause()

  mooz.transport.timeSignature = [beats, unit]

  setState({ timeSignature })

  // Notify metronome
  mooz.emit('timeSignature', timeSignature)
}
