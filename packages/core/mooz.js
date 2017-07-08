import { Emitter } from 'core/events'
import tone from './tone'
import './tone/source/MultiPlayer'

const mooz = new Emitter

mooz.extend({
  tone,
  context: tone.context, // TODO: Check support for audio context
  transport: tone.Transport,
})

module.exports = mooz