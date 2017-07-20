import mooz from './base'
import * as context from './state'
import { createContext } from 'core/state'

console.log('MOOZ CONTEXT', context)

const { state, actions } = createContext(context)

mooz.extend({
  state,
  ...actions
})

module.exports = mooz