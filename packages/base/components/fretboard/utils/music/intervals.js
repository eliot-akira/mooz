
let INTERVAL_NAMES = [
  'P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'T', 'P5', 'm6', 'M6', 'm7', 'M7' //, 'P8'
]

let MAX_INTERVAL_INDEX = INTERVAL_NAMES.length

export function getIntervalName(index) {
  return INTERVAL_NAMES[ index % MAX_INTERVAL_INDEX ]
}
