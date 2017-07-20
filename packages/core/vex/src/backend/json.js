module.exports = function(Vex) {

  if (! Vex.Flow.Backend) Vex.Flow.Backend = {}

/**
 * Vex.Flow.Backend.Json - return measures from intermediate JSON representation
 * @constructor
 */
  Vex.Flow.Backend.Json = function() {
    this.documentObject = null
  }

/**
 * "Parse" an existing IR document object (not necessarily a Document instance)
 * @param object The original document object
 */
  Vex.Flow.Backend.Json.prototype.parse = function(object) {
    if (! Vex.Flow.Backend.Json.appearsValid(object))
      throw new Vex.RERR("InvalidArgument",
                       "IR object must be a valid document")

  // Force a first-class document object to get all measures
    if (typeof object.getNumberOfMeasures == "function"
      && typeof object.getMeasure == "function") {
      let numMeasures = object.getNumberOfMeasures()
      for (let i = 0; i < numMeasures; i++) object.getMeasure(i)
    }
    this.documentObject = object
    this.valid = true
  }

/**
 * Returns true if the passed-in code parsed without errors.
 *
 * @return {Boolean} True if code is error-free.
 */
  Vex.Flow.Backend.Json.prototype.isValid = function() { return this.valid }

/**
 * Class method.
 * Returns true if the argument appears to a valid document object.
 * Used when automatically detecting VexFlow IR.
 *
 * @return {Boolean} True if object looks like a valid document.
 */
  Vex.Flow.Backend.Json.appearsValid = function(object) {
    return typeof object == "object" && object.type == "document"
  }

/**
 * Number of measures in the document
 *
 * @return {Number} Total number of measures
 */
  Vex.Flow.Backend.Json.prototype.getNumberOfMeasures = function() {
    return this.documentObject.measures.length
  }

/**
 * Create the ith measure from this.measures[i]
 *
 * @return {Vex.Flow.Measure} ith measure as a Measure object
 */
  Vex.Flow.Backend.Json.prototype.getMeasure = function(i) {
    return new Vex.Flow.Measure(this.documentObject.measures[i])
  }

/**
 * @return {Array} Stave connectors
 * Each stave connector has a type, array of parts, and one or more true
 * out of system_start, measure_start, and system_end.
 */
  Vex.Flow.Backend.Json.prototype.getStaveConnectors = function() {
    if (this.documentObject.staveConnectors)
      return this.documentObject.staveConnectors
    if (typeof this.documentObject.getStaveConnectors == "function")
      return this.documentObject.getStaveConnectors()
    return []
  }

  return Vex
}
