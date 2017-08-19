
// MIDI note

const noteMap = {}
const noteNumberMap = {}

export const notes = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ]

for (let i = 0; i < 127; i++) {

  let index = i
  let key = notes[index % 12]
  let octave = ((index / 12) | 0) -2 // MIDI scale starts at octave = -2

  key += octave

  noteMap[key] = i
  noteNumberMap[i] = key
}

const sharpsToFlats = {
  'A#': 'Bb',
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
}

function normalizeNoteName(name) {
  if (name.length>2 && name[1]==='#') {
    const note = name.slice(0, 2)
    const octave = name.slice(2)
    if (sharpsToFlats[note]) name = `${sharpsToFlats[note]}${octave}`
  }
  return name
}

function midiToNoteName(midi) {
  return noteNumberMap[midi]
}

export { noteMap, noteNumberMap, midiToNoteName }