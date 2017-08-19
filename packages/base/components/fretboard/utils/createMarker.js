import { getNoteIndex, getNoteName, getIntervalName } from './music'
import { absoluteToNoteNumber } from './midi'

export default function createMarker({ markerType, markerColor, index, tonic }) {

  let marker = {
    interval: true //notes[index], // true/false
  }

  // Absolute note index 0~87
  let absoluteIndex = index
  // Relative note index based on tonic: 0~11
  let relativeIndex = (index - tonic) % 12

  if (markerType==='absolute')  marker.label = absoluteIndex+''
  else if (markerType==='midi')  marker.label = absoluteToNoteNumber(absoluteIndex)
  else if (markerType==='relative') marker.label = relativeIndex+''
  else if (markerType==='interval') marker.label = getIntervalName(relativeIndex)

  // Note name

  // TODO: accidentals per key

  else marker.label = getNoteName(index).slice(0, -1) // Remove octave



  // Marker color

  // background, text, border

  marker.color = markerColor + (markerColor==='rainbow' ? `-${relativeIndex}` : '')

  return marker
}