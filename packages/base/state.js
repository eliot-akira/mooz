import mooz from './base'

export const state = {
  isAvailable: mooz ? true : false,

  isLoading: false,
  isLoaded: false,

  isPlaying: false,
  isPaused: false,
  isStopped: true,
  isMuted: false,

  volume: .8,
  tempo: 100, // bpm

  timeSignature: {
    beats: 4, // numerator/top - Number of beats
    unit: 4 // denominator/bottom - Unit: quarter, eighth..
  },

  position: {
    bar: 1,
    beat: 1
  },

  pickupMeasure: 0,

  currentScore: null,

}

export * as actions from './actions'