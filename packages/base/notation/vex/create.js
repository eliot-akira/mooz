//import Schema from 'base/schema'
import createMeasure from './measure'
import createStaveConnectors from './staveConnectors'

export default function createDocumentFromScore(props = {}) {

  if (props.type && props.type==='document') return props

  const doc = {
    type: 'document',
    // Must have at least 1 measure
    measures: [
      createMeasure()
    ],
    staveConnectors: createStaveConnectors()
  }

  // Generate document from simplified format

  const {
    parts
  } = props


  return doc
}

/*const scoreSchema = new Schema('score', (type) => ({
  measures: [
    { parts: [
        voices: [
          {
            notes: []
          }
        ],
        staves: []
      ]
    }
  ]
}))
*/