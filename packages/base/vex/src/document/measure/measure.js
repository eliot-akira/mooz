/**
 * Measure - intermediate representation of measures of a Vex.Flow.Document
 * @author Daniel Ringwalt (ringw)
 */
module.exports = function(Vex) {

  const log = (...args) =>
    Vex.Flow.Measure.DEBUG
    ? console.log('Vex.Flow.Measure', args)
    : null

  /** @constructor */
  Vex.Flow.Measure = function(object) {

    if (typeof object != "object")
      throw new Vex.RERR("ArgumentError", "Invalid argument to Vex.Flow.Measure")
    if (! object.time || ! object.time.num_beats || ! object.time.beat_value)
      throw new Vex.RERR("ArgumentError",
          "Measure must be initialized with nonzero num_beats and beat_value")

    this.type = "measure"

    this.time = Vex.Merge({}, object.time)

    // Number of stave lines
    if (object.num_lines) this.num_lines = object.num_lines

    this.attributes = {}
    if (typeof object.attributes == "object")
      Vex.Merge(this.attributes, object.attributes)

    this.parts = new Array(1) // default to 1 part
    if (typeof object.getParts == "function")
      this.parts = object.getParts() // Copy parts from first-class object
    else if (object.parts instanceof Array) {
      this.parts.length = object.parts.length
      for (let i = 0; i < object.parts.length; i++)
        this.parts[i] = new Vex.Flow.Measure.Part(object.parts[i])
    }

    //log('NEW MEASURE', object, this)
  }

  Vex.Flow.Measure.DEBUG = false

  Vex.Flow.Measure.prototype.setAttributes = function(attributes) {
    Vex.Merge(this.attributes, attributes)
  }

  Vex.Flow.Measure.prototype.getNumberOfParts = function(numParts) {
    return this.parts.length
  }
  Vex.Flow.Measure.prototype.setNumberOfParts = function(numParts) {
    this.parts.length = numParts
  }

  Vex.Flow.Measure.prototype.getPart = function(partNum) {
    if (! this.parts[partNum]) {
    // Create empty part
      this.parts[partNum] = new Vex.Flow.Measure.Part({ time: this.time })
    }

    log('GET PART', partNum, this.parts[partNum])

    return this.parts[partNum]
  }

  Vex.Flow.Measure.prototype.setPart = function(partNum, part) {
    if (this.parts.length <= partNum) {
      throw new Vex.RERR("ArgumentError", "Set number of parts before adding part")
    }

    log('SET PART', partNum, part)

    this.parts[partNum] = new Vex.Flow.Measure.Part(part)
  }

  Vex.Flow.Measure.prototype.getParts = function() {
    for (let i = 0; i < this.parts.length; i++) this.getPart(i)
    return this.parts.slice(0) // copy array
  }

  Vex.Flow.Measure.prototype.getNumberOfStaves = function() {
  // Sum number of staves from each part
    let totalStaves = 0
    for (let i = 0; i < this.getNumberOfParts(); i++)
      totalStaves += this.getPart(i).getNumberOfStaves()
    return totalStaves
  }
  Vex.Flow.Measure.prototype.getStave = function(staveNum) {
    let firstStaveForPart = 0
    for (let i = 0; i < this.getNumberOfParts(); i++) {
      let part = this.getPart(i)
      if (firstStaveForPart + part.getNumberOfStaves() > staveNum) {
        return part.getStave(staveNum - firstStaveForPart)
      }
      firstStaveForPart += part.getNumberOfStaves()
    }
    return undefined
  }
  Vex.Flow.Measure.prototype.getStaves = function() {
    let numStaves = this.getNumberOfStaves()
    let staves = new Array()
    for (let i = 0; i < numStaves; i++) {
      staves.push(this.getStave(i))
    }
    return staves
  }

/**
 * Add a note to the end of the voice.
 * This is a convenience method that only works when there is one part and
 * one voice. If there is no room for the note, a Vex.RuntimeError is thrown.
 * @param {Object} Note object
 */
  Vex.Flow.Measure.prototype.addNote = function(note) {
    if (this.getNumberOfParts() != 1)
      throw new Vex.RERR("ArgumentError", "Measure.addNote requires single part")
    this.getPart(0).addNote(note)
  }

}
