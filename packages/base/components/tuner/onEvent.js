import { testFrequencies } from './constants'

const sampleLengthMilliseconds = 100
let buffer = []
let recording = true

// Microphone -> worker

export default function onEvent({ event, audioContext, worker }) {

  if (!recording) return

  buffer = buffer.concat(
    Array.prototype.slice.call(event.inputBuffer.getChannelData(0))
  )

  // Stop recording after sampleLengthMilliseconds
  if (buffer.length > sampleLengthMilliseconds * audioContext.sampleRate / 1000) {

    recording = false

    worker.postMessage({
      timeseries: buffer,
      testFrequencies: testFrequencies,
      sampleRate: audioContext.sampleRate
    })

    buffer = []

    setTimeout(() => recording = true, 250)
  }
}
