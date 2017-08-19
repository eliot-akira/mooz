import mooz from '../base'

const log = require('base/log')('mooz/load',
  false
  //(...args) => console.log(...args)
)

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

      actions.prepare().then(()=> {
        log.success('Loaded players', players)
        resolve()
      })
    }))
}

export function prepare(props, { actions }) {
  return new Promise((resolve, reject) => {
    log.success('Prepare')

    // Initialize schedules and audio buffers
    // Seems to improve latency of first note
    actions.setMute(true)
    /*actions.start()
    actions.stop()
    actions.setMute(false)
    resolve()*/
    setTimeout(() => {
      actions.start()
      actions.stop()
    }, 10)
    setTimeout(() => {
      actions.setMute(false)
      resolve()
    }, 300)
  })
}