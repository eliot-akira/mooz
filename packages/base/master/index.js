import mooz from '../base'

// Master control for all players

export function initMaster(props, { state, actions }) {

  mooz.channels.master = {
    control: new mooz.tone.Gain().toMaster(),
    effects: {}
  }

  actions.setVolume({
    volume: state.volume
  })

  //console.log('Master channel', mooz.channels.master)

  // All instruments should connect to master
}

export function setMute(mute, { setState }) {

  // TODO: Mute player by name

  Object.keys(mooz.players).forEach(key => {
    const { setMute } = mooz.players[key]
    if (setMute) setMute(mute)
  })
  //console.log('SET MUTE', mute, Object.keys(mooz.players))

  setState({ isMuted: mute })
}


export function getVolume(props, { state }) {

  const {
    channel = 'master',
    player
  } = props

  if (player) {

    const p = mooz.players[player]

    if (p && p.audioPlayer) return p.getVolume()

    //console.warn(`Player "${player}" not found or not ready`)

    return 0.8 // Default - TODO: Get this from player itself
  }

  return mooz.channels[channel].control.gain.value
}

export function setVolume(props, { setState }) {

  const {
    volume,
    channel = 'master',
    player
  } = props

  //console.log('setVolume', props)

  if (player) {

    const p = mooz.players[player]

    if (p && p.audioPlayer) {
      p.setVolume(volume)
    } else {
      console.warn(`Player "${player}" not found or not ready`)
    }

  } else {

    mooz.channels[channel].control.gain.value = volume

    if (channel==='master') {
      setState({ volume })
    }
  }

  mooz.emit('volume', {
    ...props,
    value: volume * 100
  })
}

