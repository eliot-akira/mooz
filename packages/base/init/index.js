import mooz from '../base'

const log = require('base/log')('mooz/init',
  false//(...args) => console.log(...args)
)

export async function init(props = {}, { actions, setState }) {

  if (!mooz) throw new Error('Mooz is not available')

  log.ok('mooz.actions.init', mooz, props)

  setState({
    isAvailable: true
  })

  await actions.initMaster(props)
  await actions.initMetronome(props)
  await actions.load(props)
}

export const get = () => mooz
export const on = (props) => {
  const { event, callback } = props || {}
  if (!props) console.trace()

  return mooz.on(event, callback)
}