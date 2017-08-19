
export const NOTES = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']
//export const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

export const MAX_NOTES = NOTES.length

export const SHARPS_TO_FLATS = {
  'A#': 'Bb',
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
}

export const FLATS_TO_SHARPS = {
  'Bb': 'A#',
  'Db': 'C#',
  'Gb': 'F#',
  'Ab': 'G#',
}

// Note index: Based on piano key number 1~88, but with 0 = A0
export const NOTE_INDEX_MIN = 0
export const NOTE_INDEX_MAX = 87


// Get note index from name syntax "A0"
export function getNoteIndex(name) {

  // Last character is octave number: 0~8
  let octave = name[ name.length - 1]

  name = name.slice(0, -1)

  if (SHARPS_TO_FLATS[name]) name = SHARPS_TO_FLATS[name]

  // A = 0 .. Ab = 11
  let n = NOTES.indexOf(name)

  // Index of this note's octave 0, increments at C1 = 3
  let octaveZero = n >= 3 ? n-12 : n

//console.log('octaveZero', octaveZero)

  let index = octaveZero + (octave * 12) // -5 + 12 = 7

//console.log('getNoteIndex', `${name}-${octave}`, index, n, octaveZero)

  return index
}


// Get note name syntax "A0" from index
export function getNoteName(index, returnObject = false) {

  let octave = 0

  // Ignore negative?
  while (index<0) {
    index += 12
    octave--
  }

  let name = NOTES[ index % MAX_NOTES ]

  // Get octave number

  // Theoretical C0 is at index -9, so offset it for A0 = 0
  octave += Math.floor((index+9) / 12)

  return returnObject
    ? { name, octave }
    : `${name}${octave}`
}


export function generateNotes({ start, intervals, max }) {

  let notes = []
  let intervalIndex = -1, intervalMax = intervals.length
  let findNext = start

  let min = NOTE_INDEX_MIN
  max = max || NOTE_INDEX_MAX

  for (let i = start; i <= max; i++) {

    let note = i === findNext // true/false

//    console.log(`NOTE #${i}: `, getNoteName(i), note ? `---> FOUND: ` : `NEXT:`, findNext, 'Interval index', intervalIndex % intervalMax)

    if (note) {
      // Next interval
      intervalIndex++
      findNext += intervals[ intervalIndex % intervalMax ]
    }

    if (i < min) continue

    notes[i] = note
  }

//  console.log('GENERATE NOTES', 'START', start, 'INTERVALS', intervals, 'NOTES', notes)

  return notes
}

