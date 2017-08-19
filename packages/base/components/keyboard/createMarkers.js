import { getNoteIndex } from '../fretboard/utils/music'
import createMarker from '../fretboard/utils/createMarker'

export default function createPianoMarkers(props) {

  let {
    notes,
    key,
    markerType,
    markerColor,
    start,
    end,
    offset = 0
  } = props

  let tonic = getNoteIndex(`${key}0`) + offset

  if (!notes) return []

  let markers = {}

  for (let index = start; index < end; index++) {
    if (notes[index]) {
      markers[index] = createMarker({ markerType, markerColor, index, tonic })
    }
  }

  return markers
}
