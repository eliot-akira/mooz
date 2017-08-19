
export default function createStave(props = {}) {

  const {
    clef = 'treble', // tab, ..
    key = 'C',
    time = '4/4',
    empty
  } = props

  const modifiers = []

  if (!empty) {
    modifiers.push(createClef(clef))
    modifiers.push(createTimeSignature(time))
    modifiers.push(createKeySignature(key))
  }

  const stave = {
    type: 'stave',
    clef,
    key,
    modifiers
  }

  return stave
}

function createClef(clef) {
  return {
    type: 'clef',
    clef,
    automatic: true
  }
}

function createTimeSignature(time) {
  const [num_beats, beat_value] = time.split('/')
  return {
    type: 'time',
    num_beats,
    beat_value,
    automatic: true
  }
}

function createKeySignature(key) {
  return {
    type: 'key',
    key,
    automatic: true
  }
}
