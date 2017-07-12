import mooz from '../mooz'
import createPlayer from '../samplePlayer'

const log = require('core/log')('mooz/player/withAudioPlayer', (...args) => console.log(...args))

export default function withAudioPlayer(player = {}) {

  const { rawBuffers: buffers } = player

  /* Unused: for Tone.MultiPlayer
  const { rawBuffers: buffers } = player
  //if (player.audioPlayer) player.audioPlayer.dispose()
  player.audioPlayer = new mooz.tone.MultiPlayer(buffers).toMaster() //.sync()
  */

  player.audioPlayer =
    createPlayer(mooz.context, buffers)
      .connect(mooz.context.destination)


  // Shortcut methods

  player.play = (...args) => {
    player.audioPlayer.start.call(player.audioPlayer, ...args)
  }

  player.setMute = mute => {
    // Mooz player
    if (player.audioPlayer.setMute) return player.audioPlayer.setMute(mute)
    // Tone player
    player.audioPlayer.mute = mute
  }

  player.setVolume = volume => {
    // Mooz player
    if (player.audioPlayer.setVolume) return player.audioPlayer.setVolume(volume)
    // Tone player
    const db = player.audioPlayer.gainToDb(volume || (volume / 100))
    player.audioPlayer.volume.value = db
  }

  player.getVolume = () => player.audioPlayer.volume.value

  if (typeof player.mute!=='undefined') player.setMute(player.mute)
  if (typeof player.volume!=='undefined') player.setVolume(player.volume)


  log.info('With audio player', player)

  log.warn('Play ghost note to initialize buffers', player.name)

  if (buffers) {

    // Find first sound

    const firstSoundName = Object.keys(buffers)[0]

    if (firstSoundName) {
      player.setMute(true)
      player.play(firstSoundName, 0, 0, 0)
      player.setMute(false)
      log.success('First sound', firstSoundName)
    }
  }

  return player
}
