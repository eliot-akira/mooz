import initArray from '../../util/initArray'
import Key from './Key'
import { NUMBER_OF_WHITE_KEYS, BLACK_KEY_POSITIONS } from './constants'
import createPianoMarkers from './createMarkers'

const Piano = ({ index, octaves, whiteKeyWidth, getKeyProps }) =>
    <div className="piano">{ /*initArray(octaves).map((octave) => (

      <div key={octave} className="piano--octave center">{
      */initArray(octaves * NUMBER_OF_WHITE_KEYS).map(num => {

        const octave = (num / NUMBER_OF_WHITE_KEYS)
        const i = num % NUMBER_OF_WHITE_KEYS

        let keys = [ <Key key={`${octave}-${i}-${index}`} type="white" {...getKeyProps(index)} /> ]
        index++

        if (BLACK_KEY_POSITIONS[i]) {
          keys.push( <Key key={`${octave}-${i}-${index}`} type="black" {...getKeyProps(index)} /> )
          index++
        }

        return (
          <div key={`${octave}-${i}`} className="piano--key-wrap" style={{ width: whiteKeyWidth }}>
            { keys }
          </div>
        )

      }) /*}</div>
    ))*/}</div>

const prepare = C => (props) => {

  let {
    start = 15, // C2 (MIDI 36) = 15 absolute
    octaves = 3,
    key = 'E',
    markerType = 'relative',
    markerColor = 'rainbow',
    offset = 0,
    notes = {},
    playing = {},
    onNoteDown, onNoteUp,
  } = props

  let index = start

  const whiteKeyWidth = ((100 / octaves) / NUMBER_OF_WHITE_KEYS)+'%'

  const markers = createPianoMarkers({
    notes, key, markerType, markerColor, offset,
    start, end: start + (octaves * 12)
  })

  const getKeyProps = (index) => ({
    markerClass: markers[index] ? `marker-${markers[index].color}` : null,
    highlight: playing[index],
    label: markers[index] ? markers[index].label : null,
    onNoteDown: () => onNoteDown && onNoteDown(index),
    onNoteUp: () => onNoteUp && onNoteUp(index),
  })

  return <C {...{
    index, octaves, whiteKeyWidth, getKeyProps
  }} />
}

export default prepare(Piano)