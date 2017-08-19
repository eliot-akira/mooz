
// Define set of frequencies to analyze microphone data

const C2 = 65.41 // C2 note, in Hz
const notes = [ 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B' ]
let testFrequencies = []

for (let i = 0; i < 30; i++) {

  const noteFrequency = C2 * (!i ? 1 : Math.pow(2, i / 12))
  const noteName = notes[i % 12]
  const note = {
    frequency: noteFrequency,
    name: noteName,
    flat: 0, sharp: 0
  }

  const sharps = []
  const flats = []
  const divisions = 4
  for (let j = 1; j < divisions; j++) {

    const fraction = j/(divisions * 2) // Until halfway to next semitone

    sharps.push({
      name: `${noteName}`,
      sharp: j, // 1/4 semitone
      flat: 0,
      frequency: C2 * Math.pow(2, (i + fraction) / 12)
    })

    flats.push({
      name: `${noteName}`,
      sharp: 0,
      flat: j, // 1/4 semitone
      frequency: C2 * Math.pow(2, (i - fraction) / 12)
    })
  }

  testFrequencies = testFrequencies.concat([ ...sharps, note, ...flats ])
}

const tunerWorkerURL = '/static/mooz/tuner-worker.js'

export { testFrequencies, tunerWorkerURL }
/*


  const justAbove = {
    name: noteName + ' (a bit sharp)',
    sharp: 1, // TODO: Exact
    frequency: noteFrequency * Math.pow(2, 1 / 48),
  }

  const justBelow = {
    name: noteName + ' (a bit flat)',
    flat: 1, // TODO: Exact
    frequency: noteFrequency * Math.pow(2, -1 / 48),
  }

  testFrequencies = testFrequencies.concat([ justBelow, note, justAbove ])

*/