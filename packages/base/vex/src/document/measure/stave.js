module.exports = function(Vex) {

  /**
   * Vex.Flow.Measure.Stave - represent one "stave" for one measure
   * (corresponds to a Vex.Flow.Stave)
   * @constructor
   */
  Vex.Flow.Measure.Stave = function(object = {}) {

    this.type = "stave"

    this.time = Vex.Merge({
      num_beats: 4,
      beat_value: 4
    }, object.time || {})

    this.clef = object.clef || 'treble'
    this.key = object.key || 'C'

    if (object.num_lines) this.num_lines = object.num_lines

    this.modifiers = []
    if (object.modifiers instanceof Array) {
      for (let i = 0; i < object.modifiers.length; i++)
        this.addModifier(object.modifiers[i])
    }

    // Create default modifiers: clef, time, key
    this.addDefaultModifiers()

    //console.log('NEW STAVE', object, this)
  }

  // Should be done every time stave block is redrawn
  Vex.Flow.Measure.Stave.prototype.addDefaultModifiers = function() {

    const s = this

    //console.log('ADD DEFAULT MODIFIERS', s)
    const keys = ['clef', 'key', 'time']
    keys.forEach(key => {

      //console.log('CHECK STAVE KEY', key, s)

      if (s.hide && s.hide[key]) return

      const check = s.getModifier(key)
      if (check) {
        //console.log('GOT MODIFIER', key, check)
        //inherit[key] = check
        return
      }

      if (!s[key]) return
      /*if (!s[key] && inherit[key]) {
        //console.log('INHERIT MODIFIER', key, inherit[key])
        s.addModifier({ ...inherit[key], automatic: true })
        return
      }*/

      const m = {
        type: key,
        [key]: s[key],
        //automatic: true
      }
      if (key!=='time') {
        m[key] = s[key]
      } else if (typeof s.time_signature==='string') {
        m.time = s.time_signature
      } else {
        if (typeof s.time==='object') {
          Object.keys(s.time).forEach(k => m[k] = s.time[k])
        }
      }

      //console.log('CREATE MODIFIER', key, m)

      s.addModifier(m)
    })
  }


  /**
   * Adds a modifier (clef, etc.), which is just a plain object with a type
   * and other properties.
   */
  Vex.Flow.Measure.Stave.prototype.addModifier = function(modifier) {

    //console.log('ADD MODIFIER', modifier)

    // Type is required for modifiers
    if (typeof modifier != "object" || typeof modifier.type != "string")
      throw new Vex.RERR("InvalidIRError",
                       "Stave modifier requires type string property")

    // Copy modifier
    // Automatic modifier: created by formatter, can be deleted
    let newModifier = { type: modifier.type,
      automatic: !!(modifier.automatic) // Force true/false
    }

    switch (modifier.type) {
    case "clef":
      if (typeof modifier.clef != "string")
        throw new Vex.RERR("InvalidIRError",
                           "Clef modifier requires clef string")
      newModifier.clef = modifier.clef
      break
    case "key":
      if (typeof modifier.key != "string")
        throw new Vex.RERR("InvalidIRError",
                           "Key modifier requires key string")
      newModifier.key = modifier.key
      break
    case "time":
      if (! modifier.num_beats || ! modifier.beat_value)
        throw new Vex.RERR("InvalidIRError",
                    "Time modifier requires nonzero num_beats and beat_value")
      newModifier.num_beats = modifier.num_beats
      newModifier.beat_value = modifier.beat_value
      newModifier.symbol = modifier.symbol
      break
    default:
      throw new Vex.RERR("InvalidIRError", "Modifier not recognized")
    }

    this.modifiers.push(newModifier)
  }

  /**
   * Find the modifier with the given type, or return null.
   */
  Vex.Flow.Measure.Stave.prototype.getModifier = function(type) {
    let mod = null
    this.modifiers.forEach(function(m) { if (m.type == type) mod = m })
    return mod
  }

  /**
   * Delete modifier(s) which have the given type.
   *
   * @param {String} Type of modifier
   */
  Vex.Flow.Measure.Stave.prototype.deleteModifier = function(modifier) {
    if (typeof modifier != "string")
      throw new Vex.RERR("ArgumentError",
                       "deleteModifier requires string argument")
  // Create new modifier array with non-matching modifiers
    let newModifiers = new Array()
    this.modifiers.forEach(function(mod) {
      if (mod.type != modifier) newModifiers.push(mod)
    })
    this.modifiers = newModifiers
  }

  /**
   * Delete all automatic modifiers (used by formatter when a measure is no
   * longer at the beginning of a system.)
   * @return {Boolean} Whether any modifiers were deleted
   */
  Vex.Flow.Measure.Stave.prototype.deleteAutomaticModifiers = function() {
    // Create new modifier array with modifiers that remain
    let anyDeleted = false
    let newModifiers = new Array()
    this.modifiers.forEach(function(mod) {
      if (mod.automatic) {

        //console.log('MODIFIER DELETED', mod)

        anyDeleted = true
      } else newModifiers.push(mod)
    })

    this.modifiers = newModifiers

    return anyDeleted
  }

}