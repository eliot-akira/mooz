import mooz from '../base'

export function getTempo() {
  return mooz.transport.bpm.value
}

export function setTempo(tempo, { setState }) {
  mooz.transport.bpm.value = tempo
  setState({ tempo })
}

// Time signature

// Pickup measure


