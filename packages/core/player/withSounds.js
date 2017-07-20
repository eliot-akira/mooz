import mooz from '../base'
import { loadSounds } from '../sounds'
import withAudioPlayer from './withAudioPlayer'

const log = require('core/log')('mooz/player/withSounds',
  false // (...args) => console.log(...args)
)

export default async function withSounds({ sounds, player = {} }, { actions }) {

  // Fetch/decode sound file and create audio buffers

  player.buffers = await loadSounds({ soundPath: sounds })

  /* Unused
  // For Tone.MultiPlayer
  player.preparedBuffers = new mooz.tone.Buffers()
  Object.keys(player.buffers).forEach((key) => {
    player.preparedBuffers.add(key, new mooz.tone.Buffer(player.buffers[key]))
  })*/

  // Pass to audio player

  withAudioPlayer({ player }, { actions })

  log.info('Player loaded with sounds', player.name)

  return player
}
