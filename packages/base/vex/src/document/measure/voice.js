module.exports = function(Vex) {


  /**
   * Vex.Flow.Measure.Voice - a voice which contains notes, etc
   * @constructor
   */
  Vex.Flow.Measure.Voice = function(object) {
    if (typeof object != 'object')
      throw new Vex.RERR('ArgumentError', 'Invalid argument to constructor')
    if (! object.time || ! object.time.num_beats || ! object.time.beat_value)
      throw new Vex.RERR('ArgumentError',
              'Constructor requires nonzero num_beats and beat_value')
    this.time = Vex.Merge({}, object.time)
    this.key = (typeof object.key == 'string') ? object.key : null
    this.notes = new Array()
    if (object.notes instanceof Array)
      object.notes.forEach(function(note) {
        this.addNote(new Vex.Flow.Measure.Note(note)) }, this)
    else this.notes = new Array()

  // Voice must currently be on a single stave
    if (typeof object.stave == 'number') this.stave = object.stave
    else this.stave = 0

    this.type = 'voice'
  }

  Vex.Flow.Measure.Voice.keyAccidentals = function(key) {

    let acc = {
      C: null,
      D: null,
      E: null,
      F: null,
      G: null,
      A: null,
      B: null
    }

    let acc_order = {
      'b': ['B', 'E', 'A', 'D', 'G', 'C', 'F'],
      '#': ['F', 'C', 'G', 'D', 'A', 'E', 'B']
    }

    let key_acc = Vex.Flow.keySignature.keySpecs[key]
    let key_acctype = key_acc.acc, num_acc = key_acc.num

    for (let i = 0; i < num_acc; i++) {
      acc[acc_order[key_acctype][i]] = key_acctype
    }

    return acc
  }

  /**
   * Add a note to the end of the voice.
   * If there is no room for the note, a Vex.RuntimeError is thrown.
   * @param {Object} Note object
   */
  Vex.Flow.Measure.Voice.prototype.addNote = function(note) {

    //log('VOICE: ADD NOTE', note)

    // TODO: Check total ticks in voice
    let noteObj = new Vex.Flow.Measure.Note(note) // copy note

    if (!note.rest && this.key && note.accidentals == null) {

      // Generate accidentals automatically
      // Track accidentals used previously in measure

      if (! this._accidentals) {
        this._accidentals = Vex.Flow.Measure.Voice.keyAccidentals(this.key)
      }
      let accidentals = this._accidentals
      let i = 0

      noteObj.accidentals = noteObj.keys.map(function(key) {

        let acc = Vex.Flow.Measure.Note.Key.GetAccidental(key)
        if (acc == 'n') {
          // Force natural
          accidentals[key] = null
        } else {
          key = note.keys[i][0].toUpperCase() // letter name of key
          if (accidentals[key] == acc) acc = null
          else {
            accidentals[key] = acc
            if (acc == null) acc = 'n'
          }
        }
        i++
        return acc
      })
    }

    //log('VOICE: ADD NOTE', noteObj)

    this.notes.push(new Vex.Flow.Measure.Note(noteObj))
  }


}