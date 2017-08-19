import { testFrequencies } from './constants'

export default function interpretResult({ event, onResult }) {

  let timeseries = event.data.timeseries
  let frequencyAmplitudes = event.data.frequencyAmplitudes

  // Compute the (squared) magnitudes of the complex amplitudes for each
  // test frequency.
  let magnitudes = frequencyAmplitudes.map(z => z[0] * z[0] + z[1] * z[1])

  // Find the maximum in the list of magnitudes.
  let maxIndex = -1
  let maxMagnitude = 0

  for (let i = 0; i < magnitudes.length; i++) {

    if (magnitudes[i] <= maxMagnitude) continue

    maxIndex = i
    maxMagnitude = magnitudes[i]
  }

  // Compute the average magnitude. We'll only pay attention to frequencies
  // with magnitudes significantly above average.
  let average = magnitudes.reduce(function(a, b) { return a + b }, 0) / magnitudes.length
  let confidence = maxMagnitude / average
  let confidence_threshold = 10 // empirical, arbitrary.

  if (confidence > confidence_threshold) {
    onResult(testFrequencies[maxIndex])
  }
}
