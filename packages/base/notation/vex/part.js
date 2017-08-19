import createVoice from './voice'
import createStave from './stave'

export default function createPart() {

  return {
    type: 'part',
    time: {
      num_beats: 4,
      beat_value: 4,
      soft: true
    },
    voices: [
      createVoice()
    ],
    staves: [
      createStave()
    ]
  }
}
