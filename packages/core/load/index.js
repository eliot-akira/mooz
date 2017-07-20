import mooz from '../base'

const log = require('core/log')('mooz/load', (...args) => console.log(...args))

/**
 * Load one or more players
 *
 * @param  {Object} definitions { name: definition }
 * @return {Promise}
 */

export function load(definitions = {}, { actions, setState }) {

  const promises = Object.keys(definitions)
    .map(name => actions.loadPlayer({
      name,
      definition: definitions[name]
    }))

  setState({ isLoading: true, isLoaded: false })

  return Promise.all(promises)
    .then(players => new Promise((resolve, reject) => {

      setState({ isLoading: false, isLoaded: true })

      log.warn('Init all players', players)

      // Initialize schedules and audio buffers
      // Seems to improve latency of first note
      actions.setMute(true)
      setTimeout(() => {
        actions.start()
        actions.stop()
      }, 300)
      setTimeout(() => {
        actions.setMute(false)
        resolve()
      }, 1000)
    }))
}
