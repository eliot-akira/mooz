import mooz from '../base'

if (mooz.vex) require('./vex')(mooz.vex)

export function createScore(props) {
  return mooz.vex.createScore(props)
}
