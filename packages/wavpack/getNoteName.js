
const sharpsToFlats = {
  'A#': 'Bb',
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
}

function getNoteName(fileName) {

  let name = fileName.split(/_|\.|-/).slice(0, 1)[0].toUpperCase()

  if (name.length>2 && name[1]==='#') {

    const note = name.slice(0, 2)
    const octave = name.slice(2)

    if (sharpsToFlats[note]) name = `${sharpsToFlats[note]}${octave}`
  }

  return name
}

module.exports = getNoteName