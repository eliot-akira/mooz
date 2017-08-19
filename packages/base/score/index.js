import mooz from '../base'

const log = require('base/log')('mooz/score',
  //false
  (...args) => console.log(...args)
)

const nameFromSrc = src =>
  // Last part of URL
  src.split('/').slice(-1)[0]
  // Without extension
  .split('.').slice(0, -1).join('.')

let scoreId = 0

export async function createScore(props, { actions }) {

  scoreId++

  const score = {
    id: scoreId,
    name: props.src ? nameFromSrc(props.src) : scoreId,
    midi: [],
    ...props
  }

  mooz.scores[score.name] = score

  if (score.src) {
    score.xml = await mooz.actions.loadMusicXML(score)
  }

  //log('createScore', score)

  return score
}

export async function setCurrentScore(props, { actions, setState }) {

  const { name, score } = props

  const currentScore = score || actions.getScore({ name })

  await actions.loadSchedules(currentScore)

  setState({
    currentScore
  })

  mooz.emit('score', {
    value: currentScore.name
  })

  return currentScore
}

export function getScore(props = {}, { state }) {

  const { name = '' } = props

  return mooz.scores[name]
    || state.currentScore
    || mooz.scores[Object.keys(mooz.scores)[0]] // First score
}

export function startScore({ name }, { state, actions }) {

  const score = actions.getScore({ name })

  if (!score) return

  log.ok('startScore', score)

  if (!state.currentScore || state.currentScore.name!==score.name) {

    actions.setCurrentScore({ score })
      .then(actions.start)

  } else actions.start()
}
