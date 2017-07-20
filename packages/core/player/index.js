import mooz from '../base'
import withSounds from './withSounds'
import withScheduler from './withScheduler'

const log = require('core/log')('mooz/player',
  false //(...args) => console.log(...args)
)

/**
 * Load single player
 *
 * @param  {String} name
 * @param  {Object} definition
 * @return {Promise}
 */

export async function loadPlayer({ name, definition }, { actions }) {

  if (!name) {
    log.error('Player needs a name')
    return
  }

  log.ok('loadPlayer', name, definition)

  // Player is an event emitter: extend previous instance if any

  const player = mooz.players[name] || new mooz.Emitter

  player.name = name

  Object.keys(definition).forEach(key => player[key] = definition[key])

  mooz.players[name] = player

  // Sounds

  player.setSounds = sounds => withSounds({ sounds, player }, { actions })

  if (definition.sounds) {
    await player.setSounds(definition.sounds)
  }

  // Scheduler

  player.setSchedule = schedule => withScheduler({ schedule, player }, { actions })

  if (definition.schedule) {
    player.setSchedule(definition.schedule) // Pass new or previous schedule
  }

  log('Player loaded', player.name)

  return player
}
