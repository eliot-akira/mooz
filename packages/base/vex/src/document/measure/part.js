module.exports = function(Vex) {


  /**
   * Vex.Flow.Measure.Part - a single part (may include multiple staves/voices)
   * @constructor
   */
  Vex.Flow.Measure.Part = function(object) {

    if (typeof object != "object")
      throw new Vex.RERR("ArgumentError", "Invalid argument to constructor")

    if (! object.time || ! object.time.num_beats || ! object.time.beat_value)
      throw new Vex.RERR("ArgumentError",
              "Constructor requires nonzero num_beats and beat_value")

    this.time = Vex.Merge({}, object.time)

    // Convenience options which can be set on a part instead of a stave/voice
    this.options = { time: this.time }

    if (typeof object.clef == "string") this.options.clef = object.clef
    if (typeof object.key == "string") this.options.key = object.key
    if (typeof object.time_signature == "string") {
      this.options.time_signature = object.time_signature
    }
    if (object.num_lines) this.options.num_lines = object.num_lines

    if (typeof object.options == "object")
      Vex.Merge(this.options, object.options)

    if (typeof object.getVoices == "function") this.voices = object.getVoices()
    else if (object.voices instanceof Array) {
      let voiceOptions = this.options
      this.voices = object.voices.map(function(voice) {
        // Copy voiceOptions and overwrite with options from argument
        return new Vex.Flow.Measure.Voice(
          Vex.Merge(Vex.Merge({}, voiceOptions), voice)
        )
      })
    }
    else this.voices = new Array(1) // Default to single voice

    if (typeof object.getStaves == "function") this.staves = object.getStaves()
    else if (object.staves instanceof Array) {
      let staveOptions = this.options
      this.staves = object.staves.map(function(stave) {
        let staveObj
        if (typeof stave == "string") // interpret stave as clef value
          staveObj = Vex.Merge({ clef: stave }, staveOptions)
        // Copy staveOptions and overwrite with options from argument
        else staveObj = Vex.Merge(Vex.Merge({}, staveOptions), stave)
        return new Vex.Flow.Measure.Stave(staveObj)
      })
    } else {
      if (typeof object.staves == "number")
        this.staves = new Array(object.staves)
      else this.staves = new Array(1)
    }

    //console.log('CREATE PART', object, this)

    this.type = "part"
  }

  Vex.Flow.Measure.Part.prototype.getNumberOfVoices = function(numVoices) {
    return this.voices.length
  }

  Vex.Flow.Measure.Part.prototype.setNumberOfVoices = function(numVoices) {
    this.voices.length = numVoices
  }

  Vex.Flow.Measure.Part.prototype.getVoice = function(voiceNum) {
    if (! this.voices[voiceNum])
    // Create empty voice
      this.voices[voiceNum] = new Vex.Flow.Measure.Voice(
                              Vex.Merge({ time: this.time }, this.options))
    return this.voices[voiceNum]
  }

  Vex.Flow.Measure.Part.prototype.setVoice = function(voiceNum, voice) {
    if (this.voices.length <= voiceNum)
      throw new Vex.RERR("ArgumentError",
                       "Set number of voices before adding voice")
    this.voices[voiceNum] = new Vex.Flow.Measure.Voice(voice)
  }

  Vex.Flow.Measure.Part.prototype.getVoices = function() {
    for (let i = 0; i < this.getNumberOfVoices(); i++) this.getVoice(i)
    return this.voices.slice(0)
  }

  Vex.Flow.Measure.Part.prototype.getNumberOfStaves = function(numStaves) {
    return this.staves.length
  }

  Vex.Flow.Measure.Part.prototype.setNumberOfStaves = function(numStaves) {
    this.staves.length = numStaves
  }

  Vex.Flow.Measure.Part.prototype.getStave = function(staveNum) {
    if (! this.staves[staveNum]) {
      // Create empty stave
      this.staves[staveNum] = new Vex.Flow.Measure.Stave(
        Vex.Merge({ time: this.time }, this.options)
      )
    }
    return this.staves[staveNum]
  }

  Vex.Flow.Measure.Part.prototype.setStave = function(staveNum, stave) {
    if (this.staves.length <= staveNum)
      throw new Vex.RERR("ArgumentError",
                       "Set number of staves before adding stave")
    this.staves[staveNum] = new Vex.Flow.Measure.Stave(
                            Vex.Merge(Vex.Merge({}, this.options), stave))
  }

  Vex.Flow.Measure.Part.prototype.getStaves = function() {
    for (let i = 0; i < this.getNumberOfStaves(); i++) this.getStave(i)
    return this.staves.slice(0)
  }

/* True if there should be a brace at the start of every line for this part. */
  Vex.Flow.Measure.Part.prototype.showsBrace = function() {
    return (this.staves.length > 1)
  }

  /**
   * Add a note to the end of the voice.
   * This is a convenience method that only works when the part only has
   * one voice. If there is no room for the note, a Vex.RuntimeError is thrown.
   * @param {Object} Note object
   */
  Vex.Flow.Measure.Part.prototype.addNote = function(note) {
    if (this.getNumberOfVoices() != 1)
      throw new Vex.RERR("ArgumentError", "Measure.addNote requires single part")
    this.getVoice(0).addNote(note)
  }

}