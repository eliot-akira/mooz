import mooz from '../base'

const log = require('base/log')('mooz/channel',
  //false
  (...args) => console.log(...args)
)

// Set up audio processing chain

export function createChannel(props) {

  const { name } = props

  if (!mooz.channels[name]) mooz.channels[name] = {}

  const channel = mooz.channels[name]

  const keys = ['name', 'effects', 'control']
  keys.forEach(key => {
    if (typeof channel[key]!=='undefined') return
    if (key==='effects') {
      if (!channel.effects) channel.effects = []
      if (props.effects) channel.effects.push(...props.effects)
    } else if (key==='control') {
      if (!channel.control) channel.control = new mooz.tone.Gain()
    } else if (props[key]) channel[key] = props[key]
  })

  // Connect all channels to master
  if (name!=='master') channel.control.chain(
    mooz.channels.master.control.output
  )

  // Connect audio players to channel
  Object.keys(mooz.players).forEach(key => {

    const p = mooz.players[key]

    if (!p.channel || p.channel!==name || !p.audioPlayer) return

    log('Connect player to channel', p.name, name)

    p.audioPlayer.connect(channel.control)
  })

  return channel
}

export * from './effect'
