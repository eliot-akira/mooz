import mooz from '../base'

// Consolidate back/forward

export const forwardBeat = (props, { state, actions }) => {

  const { getPosition, setPosition } = actions
  const { numBeats } = state.timeSignature

  let { bar, beat } = getPosition()

  beat++

  if (beat > numBeats) {
    // Next bar
    bar++
    beat = 1
  }

  setPosition({ bar, beat })
}

export const backBeat = (props, { actions }) => {

  const { getPosition, setPosition } = actions
  let { bar, beat } = getPosition()

  beat--

  setPosition({ bar, beat })
}


export const forwardBar = (props, { actions }) => {
  const { getPosition, setPosition } = actions
  let { bar, beat } = getPosition()

  // Next bar, first beat
  bar++
  beat = 1
  //beat += setBeat // Current beat

  setPosition({ bar, beat })
}

export const backBar = (props, { actions }) => {
  const { getPosition, setPosition } = actions
  let { bar, beat } = getPosition()

  // If after first beat, back to beginning of current bar
  if (beat>1) {
    beat = 1
  } else {
    bar--
  // If on first beat, go to previous bar
  }

  setPosition({ bar, beat })
}
