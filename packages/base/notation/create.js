import mooz from '../base'

// Notation score shortcuts

if (mooz.vex) require('./vex')(mooz.vex)

const log = require('base/log')('mooz/notation',
  false
  //(...args) => console.log(...args)
)

export function createNotation(props) {

  log('createNotation', props)


  return mooz.vex.createScore(props)
}
