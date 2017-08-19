import mooz from '../base'

const log = require('base/log')('mooz/transport/control', (...args) => console.log(...args))

let firstTime = true

export const start = (props, { setState }) => {

  mooz.transport.start(firstTime ? '+0.2' : '+0.1') // Schedule ahead

  mooz.emit('start')

  setState({ isPlaying: true, isStopped: false, isPaused: false })
}


export const pause = (props = {}, { actions, setState }) => {

  const { closestBeat = true } = props

  mooz.transport.pause()

  setState({ isPlaying: false, isStopped: false, isPaused: true })

  /*if (closestBeat) {

    const { bar, beat } = actions.getPosition()
    const time = `${bar}:${beat}:0` // `${bar}:0:0`

    log('Pause at closest beat', time)

    actions.setPosition({
      bar, beat
    })

  }*/

  mooz.emit('pause')
}


export const stop = (props, { actions, setState }) => {

  mooz.transport.stop()

  actions.setPosition({ bar: 1, beat: 1 })

  setState({ isPlaying: false, isStopped: true, isPaused: false })

  mooz.emit('stop')
}
