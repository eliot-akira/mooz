import mooz from '../mooz'

export function getTempo() {
  return mooz.transport.bpm.value
}

export function setTempo(tempo) {
  mooz.transport.bpm.value = tempo
}
