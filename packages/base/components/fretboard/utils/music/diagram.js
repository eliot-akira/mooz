import { getNoteIndex, generateNotes } from './notes'
import { getPattern } from './patterns'

let cache = {}

export function getPatternDiagram({ key, pattern }) {

  key = key.split('/')[0] // Remove alternate name, i.e., Bb/A#

  let name = `${key} ${pattern}`

  if (cache[name]) return cache[name]

  // Starting note

  let start = getNoteIndex( key+'0' ) // Lowest octave
  if (start > 0) start -= 12 // Go below A0 for partial scale before tonic

  // Intervals

  let intervals = getPattern(pattern)

  if (!intervals) return false

  // Generate note pattern

  let notes = generateNotes({ start, intervals })
/*
  let diagram = {
    //title: `${pattern} ${type} in ${key}`,
    start,
    intervals,
    notes
  }
*/
  let diagram = notes
  cache[name] = diagram

//console.log('DIAGRAM', diagram)
  return diagram
}
