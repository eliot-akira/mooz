import mooz from '../base'
import withSounds from './withSounds'
import withScheduler from './withScheduler'

const log = require('base/log')('mooz/player',
  //false
  (...args) => console.log(...args)
)

/**
 * Load single player
 *
 * @param  {String} name
 * @param  {Object} definition
 * @return {Promise}
 */

export async function loadPlayer(props, { actions }) {

  const {
    name,
    definition = {},
    src,
    channel,
    volume
  } = props

  if (!name) {
    log.error('Player needs a name', props)
    return
  }

  //log('Load player', name, props)

  // Shortcut to load sounds only
  if (src) definition.sounds = src

  // Player is an event emitter: extend previous instance if any

  const player = mooz.players[name] || new mooz.Emitter

  player.name = name

  if (channel) player.channel = channel

  Object.keys(definition).forEach(key => player[key] = definition[key])

  mooz.players[name] = player

  // Sounds

  player.setSounds = sounds => withSounds({ sounds, player }, { actions })

  if (definition.sounds) {

    await player.setSounds(definition.sounds)

    log(`Sounds loaded for player "${name}"`, player.sounds)

    const value = typeof volume!=='undefined'
      ? volume / 100
      : 0.8
    actions.setVolume({
      volume: value,
      player: name
    })
  }

  // Scheduler

  player.setSchedule = schedule => withScheduler({ schedule, player }, { actions })

  if (definition.schedule) {

    player.setSchedule(definition.schedule) // Pass new or previous schedule

    //log(`Schedule loaded for player "${name}"`, player.schedule)
  }

  return player
}

export function clearPlayerSchedules() {
  Object.keys(mooz.players).forEach(key => {
    const p = mooz.players[key]
    if (p.setSchedule) p.setSchedule([])
  })
}
