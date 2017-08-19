export const STRINGS = {
  guitar: [
    // From 1st to 6th string
    'E4',
    'B3',
    'G3',
    'D3',
    'A2',
    'E2'
  ],
}

export const getStrings = (name) => (STRINGS[name])


let fretWidthsMap = {}

export function getFretWidths(frets = 12) {

  if (fretWidthsMap[frets]) return fretWidthsMap[frets]

  let positions = []

  // Length of string between nut and bridge
  let stringLength = 100

  // Fret positions from nut
  for (let i = 0; i <= frets; i++) {
    let d = stringLength - (stringLength / Math.pow(2, i/12))
    positions.push( d )
  }

  // Ratios relative to last fret
  let max = positions[ positions.length - 1]
  positions = positions.map(p => p/max * 100)


  let widths = []

  let total = 0

  // start i = 1 to skip open string
  for (let i = 0; i <= frets; i++) {

    // Difference between previous and current positions
    let diff = positions[i] - (positions[i-1] || 0)

    widths.push(diff)
    total += diff
  }

  // total should equal 100
  //console.log('Fret widths', widths, total)

  fretWidthsMap[frets] = widths

  return widths
}
