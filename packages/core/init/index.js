import mooz from '../base'

const log = require('core/log')('mooz/init', (...args) => console.log(...args))

export async function init(props = {}, { actions, setState }) {

  if (!mooz) throw new Error('Mooz is not available')

  //log.ok('mooz.actions.init', mooz, props)

  setState({
    isAvailable: true
  })


  await actions.initMetronome(props)
  await actions.load(props)
}

export const get = () => mooz
export const on = ({ event, callback }) => mooz.on(event, callback)