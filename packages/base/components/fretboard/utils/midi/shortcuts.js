import { sendPort } from './port'

export function createShortcuts(api = {}) {

  let lastPlayed = { port: 0, channel: 0, note: 0, velocity: 0 }

  const quickSend = (message, data) => {

    if (!api.active) return

    let { port, channel, note, velocity } = { ...lastPlayed, ...data }

    if (port>=0 && channel>=0) sendPort(port, { message, note, velocity, channel })
  }

  api = Object.assign(api, {

    play: (data) => {
      data = { note: 60, velocity: 100, ...data }
      quickSend('ON', data)
      lastPlayed = data
    },
    stop: (data) => {
      data = { velocity: 0, ...data }
      quickSend('OFF', data)
    },
    program: (data) => quickSend('PROGRAM', data),
    control: (data) => quickSend('CONTROL', data)
  })

  return api
}
