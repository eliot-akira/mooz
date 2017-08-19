module.exports = function(Vex) {


  /**
   * Vex.Flow.Measure.Note - a single note (includes chords, rests, etc.)
   * @constructor
   */
  Vex.Flow.Measure.Note = function(object) {

    if (typeof object != "object")
      throw new Vex.RERR("ArgumentError", "Invalid argument to constructor")

    if (object.keys instanceof Array)
      // Copy keys array, converting each key value to the standard
      this.keys = object.keys.map(Vex.Flow.Measure.Note.Key)
    else this.keys = new Array()

    if (object.accidentals instanceof Array) {
      if (object.accidentals.length != this.keys.length)
        throw new Vex.RERR("InvalidIRError",
                         "accidentals and keys must have same length")
      this.accidentals = object.accidentals.slice(0)
    }
    else this.accidentals = null // default accidentals
  // Note: accidentals set by voice if this.accidentals == null
  //       no accidentals           if this.accidentals == [null, ...]

    this.duration = object.duration
    this.rest = !!(object.rest) // force true or false
    this.intrinsicTicks = (object.intrinsicTicks > 0)
                      ? object.intrinsicTicks : null
    this.tickMultiplier = (typeof object.tickMultiplier == "object"
                         && object.tickMultiplier)
                      ? new Vex.Flow.Fraction(object.tickMultiplier.numerator,
                              object.tickMultiplier.denominator)
                      : this.intrinsicTicks
                      ? new Vex.Flow.Fraction(1, 1) : null
    this.tuplet = (typeof object.tuplet == "object" && object.tuplet)
              ? { num_notes: object.tuplet.num_notes,

                // NOTE: beats_occupied -> notes_occupied

                notes_occupied: object.tuplet.notes_occupied
              }
              : null
    this.stem_direction = (typeof object.stem_direction == "number")
                      ? object.stem_direction : null
    this.beam = (typeof object.beam == "string")
            ? object.beam : null
    this.tie = (typeof object.tie == "string")
           ? object.tie : null
    this.lyric = (typeof object.lyric == "object" && object.lyric)
             ? { text: object.lyric.text }
             : null

    this.positions = object.positions
    this.articulations = object.articulations

    this.type = "note"
  }

  // Standardize a key string, returning the result
  Vex.Flow.Measure.Note.Key = function(key) {
    // Remove natural, get properties
    let keyProperties = Vex.Flow.keyProperties(key.replace(/n/i, ""), "treble")
    return keyProperties.key + "/" + keyProperties.octave.toString()
  }

  // Default accidental value from key
  Vex.Flow.Measure.Note.Key.GetAccidental = function(key) {
    // Keep natural, return accidental from properties
    return Vex.Flow.keyProperties(key, "treble").accidental
  }

}