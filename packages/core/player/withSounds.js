import mooz from '../mooz'
import { loadSounds } from '../sounds'
import withAudioPlayer from './withAudioPlayer'

const log = require('core/log')('mooz/player/withSounds', (...args) => console.log(...args))

export default async function withSounds(sounds, player = {}) {

  // Fetch/decode sound file and create audio buffers

  const rawBuffers = await loadSounds(sounds)

  player.buffers = new mooz.tone.Buffers()

  Object.keys(rawBuffers).forEach((key) => {
    player.buffers.add(key, new mooz.tone.Buffer(rawBuffers[key]))
  })

  // Pass to audio player

  withAudioPlayer(player.buffers, player)

  log.info('With sounds', player)

  return player
}

