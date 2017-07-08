import mooz from '../mooz'
import withSounds from './withSounds'
import withScheduler from './withScheduler'

mooz.extend({
  players: {}
})

const log = require('core/log')('mooz/player', (...args) => console.log(...args))

/**
 * Load single player
 *
 * @param  {String} name
 * @param  {Object} definition
 * @return {Promise}
 */

export async function loadPlayer(name, definition) {

  if (!name) {
    log.error('Player needs a name')
    return
  }

  log('loadPlayer', name, definition)

  // Player is an event emitter: extend previous instance if any

  const player = mooz.players[name] || new mooz.Emitter

  player.name = name

  Object.keys(definition).forEach(key => player[key] = definition[key])

  mooz.players[name] = player

  // Sounds

  player.setSounds = sounds => withSounds(sounds, player)

  if (definition.sounds) {
    await player.setSounds(definition.sounds)
  }

  // Scheduler

  player.setSchedule = schedule => withScheduler(schedule, player)

  if (definition.schedule) {
    player.setSchedule(definition.schedule) // Pass new or previous schedule
  }

  log('Player loaded', player)
}
