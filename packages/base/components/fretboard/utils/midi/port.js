import state from './state'
import { getMessageType, createMessageArray } from './message'

// "Ports" = MIDIInput instances

export const portListeners = {}

export function onPort(port, fn) {

  if (!portListeners[port]) {

    portListeners[port] = []

    // Root listener
    state.inputs[port].onmidimessage = event => {
      let data = {
        time: event.timeStamp,
        channel: (event.data[0] & 0x0f)+1, // 1~16
        message: getMessageType(event.data),
        note: event.data[1],
        velocity: event.data[2],
        port
      }
      portListeners[port].forEach(l => l(data))
    }
  }

  portListeners[port].push(fn)

  // unsubscriber
  return () => offPort(port, fn)
}

export function offPort(port, fn) {

  portListeners[port] = portListeners[port].filter(l => l !== fn)

  if (!portListeners[port].length) {
    // Remove root listener
    state.inputs[port].onmidimessage = null
  }
}

export function clearPort(port) {
  portListeners[port] = null
  state.inputs[port].onmidimessage = null
}

export function sendPort(port, { time = 0, ...data }) {

  // Convert channel index from commonly used: 1~16
  if (data.channel > 0) data.channel--

  data = createMessageArray(data)
  if (!data) return
  if (time) state.outputs[port].send(data, time)
  else state.outputs[port].send(data) // immediately
}


export const send = ({ port, ...data }) => sendPort(port, data)
