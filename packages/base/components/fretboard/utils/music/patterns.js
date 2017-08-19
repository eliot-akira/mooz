import { CHORDS } from './chords'
import { SCALES } from './scales'
import { MODES } from './modes'

let PATTERNS = {}

for (let key in CHORDS) {
  PATTERNS[`${key} chord`] = CHORDS[key]
}

PATTERNS['_'] = '' // Divider

for (let key in SCALES) {
  PATTERNS[`${key} scale`] = SCALES[key]
}

PATTERNS['__'] = '' // Divider

for (let key in MODES) {
  PATTERNS[`${key} mode`] = MODES[key]
}

export { PATTERNS }

export function getPattern(pattern) {
  return PATTERNS[pattern]
}
