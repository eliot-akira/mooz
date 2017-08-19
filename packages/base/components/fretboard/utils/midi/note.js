
// MIDI note

const noteMap = {}
const noteNumberMap = {}
export const notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]

for (let i = 0; i < 127; i++) {

	let index = i
	let key = notes[index % 12]
  let octave = ((index / 12) | 0) - 1 // MIDI scale starts at octave = -1

  key += octave

  noteMap[key] = i
  noteNumberMap[i] = key
}


export function noteNumberToName(note) {
	return noteNumberMap[note]
}

export function noteNameToNumber(note) {
	return noteMap[note]
}

// MIDI note number to "absolute index" with A0 = 0
export function noteNumberToAbsolute(note) {
  return note - 21 // A0 in MIDI = 21
}
export function absoluteToNoteNumber(note) {
  return note + 21 // A0 in MIDI = 21
}

export function frequencyFromNoteNumber(note) {
	return 440 * Math.pow(2, (note-57)/12)
}

export function frequencyToNoteNumber(f) {
	return Math.round(12.0 * getBaseLog(f / 440.0, 2) + 69)
}

function getBaseLog(value, base) {
	return Math.log(value) / Math.log(base)
}
