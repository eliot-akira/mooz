import { loadPlayer } from '../player'

/**
 * Load one or more players
 *
 * @param  {Object} definitions { name: definition }
 * @return {Promise}
 */

export function load(definitions = {}, optional) {

  if (typeof definitions==='string') {
    const name = definitions
    const definition = optional
    return loadPlayer(name, definition)
  }

  const promises = Object.keys(definitions)
    .map(name => loadPlayer(name, definitions[name]))

  return Promise.all(promises)
}

