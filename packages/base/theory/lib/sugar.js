let knowledge = require('./knowledge')

module.exports = function(teoria) {
  let Note = teoria.Note
  let Chord = teoria.Chord
  let Scale = teoria.Scale

  Note.prototype.chord = function(chord) {
    let isShortChord = chord in knowledge.chordShort
    chord = isShortChord ? knowledge.chordShort[chord] : chord

    return new Chord(this, chord)
  }

  Note.prototype.scale = function(scale) {
    return new Scale(this, scale)
  }
}
