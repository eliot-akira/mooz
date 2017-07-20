import mooz from '../base'

// Master control for all players

export function setMute(mute, { setState }) {

  Object.keys(mooz.players).forEach(key => {
    const { setMute } = mooz.players[key]
    if (setMute) setMute(mute)
  })
  //console.log('SET MUTE', mute, Object.keys(mooz.players))

  setState({ isMuted: mute })
}
