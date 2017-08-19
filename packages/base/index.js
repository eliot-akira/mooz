import { createContext } from 'base/state'
import mooz from './base'
import * as context from './state'

const { state, actions } = createContext(context)

mooz.extend({
  state,
  actions
})

module.exports = mooz