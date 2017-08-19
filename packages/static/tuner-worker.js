self.onmessage = function(event) {

  const timeseries = event.data.timeseries
  const testFrequencies = event.data.testFrequencies
  const sampleRate = event.data.sampleRate
  const amplitudes = computeCorrelations(timeseries, testFrequencies, sampleRate)
  self.postMessage({
    timeseries: timeseries,
    frequencyAmplitudes: amplitudes
  })
}

function computeCorrelations(timeseries, testFrequencies, sampleRate) {

	// 2pi * frequency gives the appropriate period to sine.
	// timeseries index / sampleRate gives the appropriate time coordinate.
  const scaleFactor = 2 * Math.PI / sampleRate
  const amplitudes = testFrequencies.map(function(f) {

    const frequency = f.frequency

		// Represent a complex number as a length-2 array [ real, imaginary ].
    const accumulator = [ 0, 0 ]

    for (let t = 0; t < timeseries.length; t++) {
      accumulator[0] += timeseries[t] * Math.cos(scaleFactor * frequency * t)
      accumulator[1] += timeseries[t] * Math.sin(scaleFactor * frequency * t)
    }

    return accumulator
  })

  return amplitudes
}
