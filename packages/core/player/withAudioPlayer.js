import mooz from '../base'
import createPlayer from '../samplePlayer'

const log = require('core/log')('mooz/player/withAudioPlayer',
  false // (...args) => console.log(...args)
)

export default function withAudioPlayer({ player = {} }, { actions }) {

  /* Unused: for Tone.MultiPlayer
  //if (player.audioPlayer) player.audioPlayer.dispose()
  player.audioPlayer = new mooz.tone.MultiPlayer(player.preparedBuffers).toMaster() //.sync()
  */

  player.audioPlayer =
    createPlayer(mooz.context, player.buffers)
      .connect(mooz.context.destination)


  // Shortcut methods

  player.play = (...args) => {
    player.audioPlayer.play.call(player.audioPlayer, ...args)
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

  return player
}
