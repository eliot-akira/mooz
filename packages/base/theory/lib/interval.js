let knowledge = require('./knowledge')
let vector = require('./vector')
let toCoord = require('../utils/intervalCoords')

function Interval(coord) {
  if (!(this instanceof Interval)) return new Interval(coord)
  this.coord = coord
}

Interval.prototype = {
  name: function() {
    return knowledge.intervalsIndex[this.number() - 1]
  },

  semitones: function() {
    return vector.sum(vector.mul(this.coord, [12, 7]))
  },

  number: function() {
    return Math.abs(this.value())
  },

  value: function() {
    let toMultiply = Math.floor((this.coord[1] - 2) / 7) + 1
    let product = vector.mul(knowledge.sharp, toMultiply)
    let without = vector.sub(this.coord, product)
    let i = knowledge.intervalFromFifth[without[1] + 5]
    let diff = without[0] - knowledge.intervals[i][0]
    let val = knowledge.stepNumber[i] + diff * 7

    return (val > 0) ? val : val - 2
  },

  type: function() {
    return knowledge.intervals[this.base()][0] <= 1 ? 'perfect' : 'minor'
  },

  base: function() {
    let product = vector.mul(knowledge.sharp, this.qualityValue())
    let fifth = vector.sub(this.coord, product)[1]
    fifth = this.value() > 0 ? fifth + 5 : -(fifth - 5) % 7
    fifth = fifth < 0 ? knowledge.intervalFromFifth.length + fifth : fifth

    let name = knowledge.intervalFromFifth[fifth]
    if (name === 'unison' && this.number() >= 8)
      name = 'octave'

    return name
  },

  direction: function(dir) {
    if (dir) {
      let is = this.value() >= 1 ? 'up' : 'down'
      if (is !== dir)
        this.coord = vector.mul(this.coord, -1)

      return this
    }
    else
      return this.value() >= 1 ? 'up' : 'down'
  },

  simple: function(ignore) {
    // Get the (upwards) base interval (with quality)
    let simple = knowledge.intervals[this.base()]
    let toAdd = vector.mul(knowledge.sharp, this.qualityValue())
    simple = vector.add(simple, toAdd)

    // Turn it around if necessary
    if (!ignore)
      simple = this.direction() === 'down' ? vector.mul(simple, -1) : simple

    return new Interval(simple)
  },

  isCompound: function() {
    return this.number() > 8
  },

  octaves: function() {
    let toSubtract, without, octaves

    if (this.direction() === 'up') {
      toSubtract = vector.mul(knowledge.sharp, this.qualityValue())
      without = vector.sub(this.coord, toSubtract)
      octaves = without[0] - knowledge.intervals[this.base()][0]
    } else {
      toSubtract = vector.mul(knowledge.sharp, -this.qualityValue())
      without = vector.sub(this.coord, toSubtract)
      octaves = -(without[0] + knowledge.intervals[this.base()][0])
    }

    return octaves
  },

  invert: function() {
    let i = this.base()
    let qual = this.qualityValue()
    let acc = this.type() === 'minor' ? -(qual - 1) : -qual
    let idx = 9 - knowledge.stepNumber[i] - 1
    let coord = knowledge.intervals[knowledge.intervalsIndex[idx]]
    coord = vector.add(coord, vector.mul(knowledge.sharp, acc))

    return new Interval(coord)
  },

  quality: function(lng) {
    let quality = knowledge.alterations[this.type()][this.qualityValue() + 2]

    return lng ? knowledge.qualityLong[quality] : quality
  },

  qualityValue: function() {
    if (this.direction() === 'down')
      return Math.floor((-this.coord[1] - 2) / 7) + 1
    else
      return Math.floor((this.coord[1] - 2) / 7) + 1
  },

  equal: function(interval) {
    return this.coord[0] === interval.coord[0] &&
          this.coord[1] === interval.coord[1]
  },

  greater: function(interval) {
    let semi = this.semitones()
    let isemi = interval.semitones()

    // If equal in absolute size, measure which interval is bigger
    // For example P4 is bigger than A3
    return (semi === isemi) ?
      (this.number() > interval.number()) : (semi > isemi)
  },

  smaller: function(interval) {
    return !this.equal(interval) && !this.greater(interval)
  },

  add: function(interval) {
    return new Interval(vector.add(this.coord, interval.coord))
  },

  toString: function(ignore) {
    // If given true, return the positive value
    let number = ignore ? this.number() : this.value()

    return this.quality() + number
  }
}

Interval.toCoord = function(simple) {
  let coord = toCoord(simple)
  if (!coord)
    throw new Error('Invalid simple format interval')

  return new Interval(coord)
}

Interval.from = function(from, to) {
  return from.interval(to)
}

Interval.between = function(from, to) {
  return new Interval(vector.sub(to.coord, from.coord))
}

Interval.invert = function(sInterval) {
  return Interval.toCoord(sInterval).invert().toString()
}

module.exports = Interval
