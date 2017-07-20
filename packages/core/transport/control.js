import mooz from '../base'

const log = require('core/log')('mooz/transport/control', (...args) => console.log(...args))


export const start = (props, { setState }) => {

  mooz.transport.start('+0.1') // Schedule ahead

  mooz.emit('start')

  setState({ isPlaying: true, isStopped: false, isPaused: false })
}


export const pause = ({ closestBeat = true }, { actions, setState }) => {

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
