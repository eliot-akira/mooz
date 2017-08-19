import createPart from './part'

export default function createMeasure() {

  return {
    type: 'measure',
    time: {
      num_beats: 4,
      beat_value: 4,
      soft: true
    },
    attributes: {},
    parts: [
      createPart(),
      createPart(),
    ]
  }
}
