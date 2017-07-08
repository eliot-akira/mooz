import mooz from '../mooz'

const log = require('core/log')('mooz/transport/control', (...args) => console.log(...args))

export const start = () => {
  mooz.transport.start()
  mooz.status = mooz.statusTypes.playing
}

export const pause = (exact = false) => {

  mooz.transport.pause()
  mooz.status = mooz.statusTypes.paused

  if (!exact) {
    const { bar, beat } = mooz.getPosition()
    const time = `${bar}:${beat}:0` // `${bar}:0:0`
    log('Pause at closes beat', time)
    mooz.setPosition(time)
  }
}

export const stop = () => {
  mooz.transport.stop()
  mooz.status = mooz.statusTypes.stopped
}
