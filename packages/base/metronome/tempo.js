import mooz from '../base'

export function getTempo() {
  return mooz.transport.bpm.value
}

export function setTempo(tempo, { setState }) {

  // Master tempo

  const value = parseInt(tempo, 10)

  mooz.transport.bpm.value = value

  setState({ tempo: value })

  mooz.emit('tempo', {
    value
  })
}

// Time signature

// Pickup measure


