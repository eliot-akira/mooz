/* global AudioBuffer */

let ADSR = require('./adsr')

let EMPTY = {}
let DEFAULTS = {
  gain: 1,
  attack: 0.01,
  decay: 0.1,
  sustain: 0.9,
  release: 0.3,
  loop: false,
  cents: 0,
  loopStart: 0,
  loopEnd: 0
}

/**
 * Create a sample player.
 *
 * @param {AudioContext} ac - the audio context
 * @param {ArrayBuffer|Object<String,ArrayBuffer>} source
 * @param {Onject} options - (Optional) an options object
 * @return {player} the player
 * @example
 * var SamplePlayer = require('sample-player')
 * var ac = new AudioContext()
 * var snare = SamplePlayer(ac, <AudioBuffer>)
 * snare.play()
 */
function createPlayer(ac, source, options) {

  let connected = false
  let nextId = 0
  let tracked = {}
  let out = ac.createGain()
  out.gain.value = 1

  let opts = Object.assign({}, DEFAULTS, options)

  /**
   * @namespace
   */
  let player = { context: ac, out: out, opts: opts }

  if (source instanceof AudioBuffer) player.buffer = source
  else player.buffers = source

  player.volume = opts.gain || 1

  /**
   * Play a note from buffer(s)
   *
   * The returned object has a function `stop(when)` to stop the sound.
   *
   * @param {String} name - the name of the buffer. If the source of the
   * SamplePlayer is one sample buffer, this parameter is not required
   * @param {Float} when - (Optional) when to start (current time if by default)
   * @param {Object} options - additional sample playing options
   * @return {AudioNode} an audio node with a `stop` function
   * @example
   * var sample = player(ac, <AudioBuffer>).connect(ac.destination)
   * sample.start()
   * sample.start(5, { gain: 0.7 }) // name not required since is only one AudioBuffer
   * @example
   * var drums = player(ac, { snare: <AudioBuffer>, kick: <AudioBuffer>, ... }).connect(ac.destination)
   * drums.start('snare')
   * drums.start('snare', 0, { gain: 0.3 })
   */

  player.play = function (props) {

    if (typeof props!=='object') {
      console.warn('Bad argument for player: must be an object', props)
      return
    }

    const {
      note, notes,
      when = 0,
      duration,
      volume = 1
    } = props

    const buffer = note ? player.buffers[note] : player.buffer

    if (!buffer) {
      console.warn('Buffer not found', note)
      return
    } else if (!connected) {
      console.warn('SamplePlayer not connected to any node.')
      return
    }

    const gain = volume * player.volume // Note volume scaled to player volume

    const contextTime = Math.max(ac.currentTime, when) // AudioContext time
      //ac.currentTime + (when || 0) // Time from now

    const node = createNode(note, buffer, opts)
    node.id = track(note, node)
    node.env.start(contextTime)
    node.source.start(contextTime)

    if (duration) node.stop(contextTime + duration)

    return node
  }


  /**
   * Stop some or all samples
   *
   * @param {Float} when - (Optional) an absolute time in seconds (or currentTime
   * if not specified)
   * @param {Array} nodes - (Optional) an array of nodes or nodes ids to stop
   * @return {Array} an array of ids of the stoped samples
   *
   * @example
   * var longSound = player(ac, <AudioBuffer>).connect(ac.destination)
   * longSound.start(ac.currentTime)
   * longSound.start(ac.currentTime + 1)
   * longSound.start(ac.currentTime + 2)
   * longSound.stop(ac.currentTime + 3) // stop the three sounds
   */
  player.stop = function (when, ids) {
    let node
    ids = ids || Object.keys(tracked)
    return ids.map(function (id) {
      node = tracked[id]
      if (!node) return null
      node.stop(when)
      return node.id
    })
  }
  /**
   * Connect the player to a destination node
   *
   * @param {AudioNode} destination - the destination node
   * @return {AudioPlayer} the player
   * @chainable
   * @example
   * var sample = player(ac, <AudioBuffer>).connect(ac.destination)
   */
  player.connect = function (dest) {
    connected = true
    out.connect(dest)
    return player
  }

  player.setVolume = volume => {
    player.volume = volume
  }

  player.setMute = mute => {
    if (!mute) {
      player.setVolume(player.previousVolume || .8)
      return
    }
    if (player.volume) {
      player.previousVolume = player.volume
    }
    player.setVolume(0)
  }

  return player

  // =============== PRIVATE FUNCTIONS ============== //

  function track (name, node) {
    node.id = nextId++
    tracked[node.id] = node
    node.source.onended = function () {
      let now = ac.currentTime
      node.source.disconnect()
      node.env.disconnect()
      node.disconnect()
    }
    return node.id
  }

  function createNode (name, buffer, options) {
    const node = ac.createGain()
    node.gain.value = 0 // the envelope will control the gain
    node.connect(out)

    node.env = envelope(ac, options, opts)
    node.env.connect(node.gain)

    node.source = ac.createBufferSource()
    node.source.buffer = buffer
    node.source.connect(node)
    node.source.loop = options.loop || opts.loop
    node.source.playbackRate.value = centsToRate(options.cents || opts.cents)
    node.source.loopStart = options.loopStart || opts.loopStart
    node.source.loopEnd = options.loopEnd || opts.loopEnd
    node.stop = function (when) {
      const time = when || ac.currentTime
      const stopAt = node.env.stop(time)
      node.source.stop(stopAt)
    }
    return node
  }
}

function isNum (x) { return typeof x === 'number' }

const PARAMS = ['attack', 'decay', 'sustain', 'release']

function envelope (ac, options, opts) {
  let env = ADSR(ac)
  let adsr = options.adsr || opts.adsr
  PARAMS.forEach(function (name, i) {
    if (adsr) env[name] = adsr[i]
    else env[name] = options[name] || opts[name]
  })
  env.value.value = isNum(options.gain) ? options.gain
    : isNum(opts.gain) ? opts.gain : 1
  return env
}

/*
 * Get playback rate for a given pitch change (in cents)
 * Basic [math](http://www.birdsoft.demon.co.uk/music/samplert.htm):
 * f2 = f1 * 2^( C / 1200 )
 */
function centsToRate (cents) { return cents ? Math.pow(2, cents / 1200) : 1 }

module.exports = createPlayer
