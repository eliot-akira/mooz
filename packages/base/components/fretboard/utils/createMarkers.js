import { getNoteIndex } from './music'
import createMarker from './createMarker'

export default function createMarkers(props) {

  let {
    notes, playing,
    strings,
    frets,
    key,
    markerType,
    markerColor,
    offset = 0
  } = props

  let tonic = getNoteIndex(`${key}0`) + offset

//console.log('GENERATE MARKERS', diagram, 'TONIC', tonic)

  if (!notes) return []

  let markers = {}

  // Each string 0 ~ max

  strings.forEach((string, stringIndex) => {

    // string = note name "A0"

    let start = getNoteIndex(string)

    markers[stringIndex] = []

//console.log('STRING #'+(stringIndex+1), start, string)

    let end = start + frets + 1 // include open string

    for (let index = start; index < end; index++) {

      let marker

      if (notes[index] || playing[index]) {
        marker = createMarker({ markerType, markerColor, index, tonic })
        marker.isPlaying = playing[index]
      } else marker = false

      markers[stringIndex].push(marker)
    }
  })

  return markers
}
