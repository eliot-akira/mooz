import state from './state'
import updateState from './update'
import { send, sendPort, onPort, offPort, clearPort } from './port'
import { createShortcuts } from './shortcuts'

let stateListeners = []

const midi = {

  active: false,

  state,

  init(onSuccess = () => {}, onFail = () => {}) {

    if (!window.navigator.requestMIDIAccess) return onFail()

    if (midi.active) return onSuccess(midi) // Init only once

    window.navigator.requestMIDIAccess().then(access => {

      midi.active = true
      state.access = access

      updateState()

      access.onstatechange = state => {
        updateState()
        stateListeners.forEach(l => l(state))
      }

      onSuccess(midi)

    }, onFail)
  },

  onStateChange(fn) {
    stateListeners.push(fn)
  },

  getInputs: () => state.inputs,
  getOutputs: () => state.outputs,

  listenAll(fn) {
    state.inputs.forEach((input, i) => onPort(i, fn))
  },

  onPort, offPort, clearPort, sendPort, send
}

createShortcuts(midi)

export default midi
export * from './note'