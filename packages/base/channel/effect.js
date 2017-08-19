import mooz from '../base'

const log = require('base/log')('mooz/channel/effect',
  //false
  (...args) => console.log(...args)
)

const translate = {
  high: 'highCut',
  low: 'lowCut',
  dry: 'dryLevel',
  wet: 'wetLevel',
  // level, bypass, impulse
  room: 'roomSize',
  damp: 'dampening'
}

const convertPercent = ['dry', 'wet', 'level', 'room']

export function addEffect(props) {

  const {
    channelName,
    effectName,
    effectProps
  } = props

  const translatedProps = {}
  Object.keys(effectProps).forEach(key => {

    const transKey = translate[key] || key
    const transValue = convertPercent.indexOf(key) >= 0
      ? (effectProps[key] / 100)
      : effectProps[key]

    translatedProps[transKey] = transValue
  })

  let effect

  switch (effectName) {

  case 'reverb': {

    effect = new mooz.tone.Freeverb()

    const p = translatedProps

    ;['roomSize', 'dampening'].forEach(key => {
      if (typeof p[key]==='undefined') return
      effect[key].value = p[key]
    })

    const {
      dryLevel = 0,
      wetLevel = 0.05
    } = p

    const wet = (wetLevel*2) - (dryLevel*2)
    //console.log('CREATED REVERB', wet)

    effect.wet.value = wet < 0 ? 0 : (
      wet > 1 ? 1 : wet
    ) // 0 ~ 1
    break
  }

  case 'convolution': //

    effect = new mooz.tuna.Convolver({
      highCut: 22050,                         //20 to 22050
      lowCut: 20,                             //20 to 22050
      dryLevel: 1,                            //0 to 1+
      wetLevel: 1,                            //0 to 1+
      level: 1,                               //0 to 1+, adjusts total output of both wet and dry
      impulse: "https://static.moozap.com/lib/impulses/impulse_guitar.wav",    //the path to your impulse response
      bypass: 0,
      ...translatedProps
    })
    break

  default:

    break
  }

  if (!effect) {
    log.warn(`Effect "${effectName}" not found`, props)
    return
  }

  //log('addEffect', channelName, effect, props)

  const channel = mooz.channels[channelName]

  channel.effects.push(effect)

  log('Effects chain', channelName, channel.effects)

  channel.control.output.chain(...channel.effects,
    channelName==='master'
    ? mooz.tone.Master
    : mooz.channels.master.control.output
  )
}
