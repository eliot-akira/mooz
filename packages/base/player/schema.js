import Schema from 'base/schema'
import mooz from '../base'

const playerSchema = new Schema('player', (type) => ({
  name: type.string,
  sounds: type.string, // Path to sound .json
  schedule: type.array,
  callback: type.func,
  buffers: type.objectOf(type.array // window.AudioBuffer
    /*type.arrayOf(
      type.instanceOf(mooz.tone.Buffer)
    )*/
  ),
  part: type.instanceOf(mooz.tone.Part)
}))
