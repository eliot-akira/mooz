import mooz from '../base'
import createPlayer from '../samplePlayer'

const log = require('base/log')('mooz/player/withAudioPlayer',
  //false
  (...args) => console.log(...args)
)

export default function withAudioPlayer({ player = {} }, { actions }) {

  /* Unused: for Tone.MultiPlayer
  //if (player.audioPlayer) player.audioPlayer.dispose()
  player.audioPlayer = new mooz.tone.MultiPlayer(player.preparedBuffers).toMaster() //.sync()
  */

  player.audioPlayer = createPlayer(mooz.context, player.buffers)

  player.connectChannel = (channelName = 'master') => {

    if (!mooz.channels[channelName] || !mooz.channels[channelName].control) {

      log.error(`Channel "${channelName}" not found`, mooz.channels[channelName])

    } else {

      //log(`Connect player "${player.name}" to channel "${channelName}"`, mooz.channels[channelName])
    }

    const { control } = mooz.channels[channelName || 'master']
      || mooz.channels.master // Defaults to master
      // Original: mooz.tone.Master, mooz.context.destination

    player.control = control
    player.audioPlayer = player.audioPlayer.connect(control)
  }


  // Methods

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

  player.getVolume = () =>
    player.audioPlayer.volume
    //player.audioPlayer.volume.value


  // Init

  player.connectChannel(player.channel)

  if (typeof player.mute!=='undefined') player.setMute(player.mute)
  if (typeof player.volume!=='undefined') player.setVolume(player.volume)


  //log.info('With audio player', player.name, player)

  return player
}
