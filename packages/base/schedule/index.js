export { createScheduler } from './scheduler'

export async function loadSchedules(props, { actions }) {

  const { midi = [] } = props

  actions.clearPlayerSchedules()

  return Promise.all(midi.map(definition => {

    return actions.loadPlayer({
      name: definition.player,
      definition
    })
  }))
}
