import mooz from '../mooz'

const log = require('core/log')('mooz/player/withAudioPlayer', (...args) => console.log(...args))

export default function withAudioPlayer(buffers, player = {}) {

  // Audio player

  //if (player.audioPlayer) player.audioPlayer.dispose()

  player.audioPlayer = new mooz.tone.MultiPlayer(buffers).toMaster() //.sync()
  /*player.audioPlayer =
    createPlayer(mooz.context, rawBuffers)
      .connect(mooz.context.destination)*/


  // Shortcut methods

  player.play = (...args) => {
    player.audioPlayer.start.call(player.audioPlayer, ...args)
  }

  player.setMute = mute => player.audioPlayer.mute = mute

  player.setVolume = volume => {
    const db = player.audioPlayer.gainToDb(volume || (volume / 100))
    player.audioPlayer.volume.value = db
  }

  player.getVolume = () => player.audioPlayer.volume.value

  if (typeof player.mute!=='undefined') player.setMute(player.mute)
  if (typeof player.volume!=='undefined') player.setVolume(player.volume)


  log.info('With audio player', player)

  return player
}
