/* eslint-disable no-case-declarations */
/**
 * DocumentFormatter - format and display a Document
 * @author Daniel Ringwalt (ringw)
 */
module.exports = function(Vex) {

  const log = (...args) =>
    Vex.Flow.DocumentFormatter.DEBUG
    ? console.log('Vex.Flow.DocumentFormatter', args)
    : null

  /**
   * Accepts document as argument and draws document in discrete blocks
   *
   * @param {Vex.Flow.Document} Document object to retrieve information from
   * @constructor
   */
  Vex.Flow.DocumentFormatter = function(document, options) {
    if (arguments.length > 0) this.init(document, options)
  }

  Vex.Flow.DocumentFormatter.DEBUG = false

  Vex.Flow.DocumentFormatter.prototype.init = function(document, options = {}) {

    if (typeof document != "object") {
      throw new Vex.RERR("ArgumentError",
      "new Vex.Flow.DocumentFormatter() requires Document object argument")
    }

    this.document = document
    this.options = options

    // Groups of measures are contained in blocks (which could correspond to a
    // line or a page of music.)
    // Each block is intended to be drawn on a different canvas.
    // Blocks must be managed by the subclass.

    this.measuresInBlock = [] // block # -> array of measure # in block
    this.blockDimensions = [] // block # -> [width, height]

    // Stave layout managed by subclass
    this.vfStaves = [] // measure # -> stave # -> VexFlow stave

    // Minimum measure widths can be used for formatting by subclasses
    this.minMeasureWidths = []

    // minMeasureHeights:
    //  this.minMeasureHeights[m][0] is space above measure
    //  this.minMeasureHeights[m][s+1] is minimum height of stave s
    this.minMeasureHeights = []
  }

  /**
   * Vex.Flow.DocumentFormatter.prototype.getStaveX: to be defined by subclass
   * Params: m (measure #), s (stave #)
   * Returns: x (number)
   */

  /**
   * Calculate vertical position of stave within block
   *
   * @param {Number} Measure number
   * @param {Number} Stave number
   */
  Vex.Flow.DocumentFormatter.prototype.getStaveY = function(m, s) {

    // Default behavour: calculate from stave above this one (or 0 for top stave)
    // (Have to make sure not to call getStave on this stave)
    // If s == 0 and we are in a block, use the max extra space above the
    // top stave on any measure in the block
    if (s == 0) {

      let extraSpace = 0

      // Find block for this measure
      this.measuresInBlock.forEach(function(measures) {

        if (measures.indexOf(m) > -1) {

          let maxExtraSpace = 25
            /*this.options.inline
            ? 18 // Minimum possible for inline
            : 50 - (new Vex.Flow.Stave(0, 0, 500).getYForLine(0))*/

          measures.forEach((measure) => {
            let extra = this.getMinMeasureHeight(measure)[0]
            if (extra > maxExtraSpace) maxExtraSpace = extra
          })

          extraSpace = maxExtraSpace
          return
        }
      }, this)

      log('formatter.getStaveY FIRST STAVE', extraSpace)

      return extraSpace
    }

    // Top pad for each stave in stack after first

    const higherStave = this.getStave(m, s - 1)
    const y = higherStave.y + higherStave.getHeight() + 30

    console.log('formatter.getStaveY', {
      measure: m,
      stave: s,
      y
    })
    return y
  }

  /**
   * Vex.Flow.DocumentFormatter.prototype.getStaveWidth: defined in subclass
   * Params: m (measure #), s (stave #)
   * Returns: width (number) which should be less than the minimum width
   */

  /**
   * Create a Vex.Flow.Stave from a Vex.Flow.Measure.Stave.
   * @param {Vex.Flow.Measure.Stave} Original stave object
   * @param {Number} x position
   * @param {Number} y position
   * @param {Number} width of stave
   * @return {Vex.Flow.Stave} Generated stave object
   */
  Vex.Flow.DocumentFormatter.prototype.createVexflowStave = function(s, x, y, w) {

    const isTab = s.clef && s.clef==='tab'

    // TODO: Adjust height for lyrics

    const staveOptions = {
      space_above_staff_ln: this.options.inline ? 0 : 2,
      space_below_staff_ln: this.options.inline ? 0 : 2
    }

    if (s.num_lines) staveOptions.num_lines = s.num_lines

    log('createVexflowStave', s, x, y, w, staveOptions)

    const vfStave = isTab
      ? new Vex.Flow.TabStave(x, y, w, staveOptions)
      : new Vex.Flow.Stave(x, y, w, staveOptions)

    s.modifiers.forEach(function(mod) {

      switch (mod.type) {
      case "clef":
        //log('ADD CLEF', mod.clef)
        vfStave.addClef(mod.clef)
        break
      case "key":
        vfStave.addKeySignature(mod.key)
        break
      case "time":
        // Skip time signature for tabs
        // drawPart() below must align tab staves' note start X
        if (!isTab) {

          let time_sig

          if (typeof mod.time == "string") time_sig = mod.time
          else time_sig = mod.num_beats.toString() + "/"
                        + mod.beat_value.toString()

          if (mod.symbol && mod.symbol==='common') {
            time_sig = 'C'
            if (mod.beat_value==2) time_sig += '|'
          }
          //log('TIME SIGNATURE', time_sig, mod)
          vfStave.addTimeSignature(time_sig)
        }
        break
      }
    })

    if (typeof s.clef == "string") vfStave.clef = s.clef


    log('createVexflowStave', { s, x, y, w }, vfStave)

    return vfStave
  }

  /**
   * Use getStaveX, getStaveY, getStaveWidth to create a Vex.Flow.Stave from
   * the document and store it in vfStaves.
   * @param {Number} Measure number
   * @param {Number} Stave number
   * @return {Vex.Flow.Stave} Stave for the measure and stave #
   */
  Vex.Flow.DocumentFormatter.prototype.getStave = function(m, s) {

    if (m in this.vfStaves && s in this.vfStaves[m])
      return this.vfStaves[m][s]

    if (typeof this.getStaveX != "function"
      || typeof this.getStaveWidth != "function")
      throw new Vex.RERR("MethodNotImplemented",
                "Document formatter must implement getStaveX, getStaveWidth")

    //log(m, this.document.getMeasure(m));
    let stave = this.document.getMeasure(m).getStave(s)

    if (! stave) return undefined

    let vfStave = this.createVexflowStave(stave,
      this.getStaveX(m, s),
      this.getStaveY(m, s),
      this.getStaveWidth(m, s)
    )

    if (! (m in this.vfStaves)) this.vfStaves[m] = []
    this.vfStaves[m][s] = vfStave

    return vfStave
  }

  /**
   * Create a Vex.Flow.Voice from a Vex.Flow.Measure.Voice.
   * Each note is added to the proper Vex.Flow.Stave in staves
   * (spanning multiple staves in a single voice not currently supported.)
   * @param {Vex.Flow.Measure.Voice} Voice object
   * @param {Array} Vex.Flow.Staves to add the notes to
   * @return {Array} Vex.Flow.Voice, objects to be drawn, optional voice w/lyrics
   */
  Vex.Flow.DocumentFormatter.prototype.getVexflowVoice =function(voice, staves) {

    const vfVoice = new Vex.Flow.Voice({
      num_beats: voice.time.num_beats,
      beat_value: voice.time.beat_value,
      resolution: Vex.Flow.RESOLUTION
    })

    if (voice.time.soft) vfVoice.setMode(Vex.Flow.Voice.Mode.SOFT)

    // TODO: support spanning multiple staves

    if (typeof voice.stave != "number")
      throw new Vex.RERR("InvalidIRError", "Voice should have stave property")

    vfVoice.setStave(staves[voice.stave])

    const vexflowObjects = []
    const vexflowObjectsAfter = []

    let beamedNotes = null // array of all vfNotes in beam
    let tiedNote = null // only last vFNote in tie
    let tupletNotes = null, tupletOpts = null
    let clef = staves[voice.stave].clef
    let lyricVoice = null

    for (let i = 0; i < voice.notes.length; i++) {

      let note = voice.notes[i]
      let vfNote = this.getVexflowNote(voice.notes[i], { clef: clef })

      if (note.beam == "begin") beamedNotes = [vfNote]
      else if (note.beam && beamedNotes) {
        beamedNotes.push(vfNote)
        if (note.beam == "end") {
          vexflowObjects.push(new Vex.Flow.Beam(beamedNotes, true))
          beamedNotes = null
        }
      }

      if (note.tie == "end" || note.tie == "continue") {

        // TODO: Tie only the correct indices

        vexflowObjects.push(new Vex.Flow.StaveTie({
          first_note: tiedNote, last_note: vfNote
        }))
      }

      if (note.tie == "begin" || note.tie == "continue") tiedNote = vfNote

      if (note.tuplet) {
        if (tupletNotes) tupletNotes.push(vfNote)
        else {
          tupletNotes = [vfNote]
          tupletOpts = note.tuplet
        }
        if (tupletNotes.length == tupletOpts.num_notes) {

          vexflowObjects.push(new Vex.Flow.Tuplet(tupletNotes, tupletOpts))

          tupletNotes.forEach((n) => vfVoice.addTickable(n))
          tupletNotes = null
          tupletOpts = null
        }

      } else {
        vfVoice.addTickable(vfNote)
      }


      if (note.articulations) {
        if (note.articulations.accent || note.articulations.staccato) {

          // vexflow/tables.js 260
          const artic = new Vex.Flow.Articulation( note.articulations.accent ? 'a>' : 'a.')
          const pos = note.stem_direction && note.stem_direction==='up'
          ? 'below' : 'above'

          artic.setPosition(pos)

          artic.setModifierContext(vfNote)
          artic.note = vfNote
          artic.index = 0

          vexflowObjectsAfter.push(artic)

          // Argument order opposite for TabNote!
          /*if (isTab) vfNote.addModifier(artic, 0)
          else vfNote.addModifier(0, artic)*/
        }
      }

      // Lyric

      if (note.lyric) {

        if (! lyricVoice) {

          lyricVoice = new Vex.Flow.Voice(vfVoice.time)

          if (voice.time.soft) lyricVoice.setMode(Vex.Flow.Voice.Mode.SOFT)

          lyricVoice.setStave(vfVoice.stave)

          // TODO: add padding at start of voice if necessary
        }

        const textNote = new Vex.Flow.TextNote({
          text: note.lyric.text,
          duration: note.duration
        })

        textNote.setJustification(Vex.Flow.TextNote.Justification.CENTER),
        //textNote.setLine(5)

        lyricVoice.addTickable(textNote)

      } else if (lyricVoice) {

        // Add GhostNote for padding lyric voice
        lyricVoice.addTickable(new Vex.Flow.GhostNote({
          duration: note.duration
        }))
      }

    } // Each voice note




    if (!(vfVoice.stave instanceof Vex.Flow.Stave)) {
      console.error("VexFlow voice should have a stave")
    }

    log('DocumentFormatter.getVexflowVoice', { voice, staves }, {
      vfVoice, vexflowObjects, lyricVoice
    })

    return [vfVoice, vexflowObjects.concat(vexflowObjectsAfter), lyricVoice]
  }

  /**
   * Create a Vex.Flow.StaveNote from a Vex.Flow.Measure.Note.
   * @param {Vex.Flow.Measure.Note} Note object
   * @param {Object} Options (currently only clef)
   * @return {Vex.Flow.StaveNote} StaveNote object
   */
  Vex.Flow.DocumentFormatter.prototype.getVexflowNote = function(note, options) {

    let noteObj = Vex.Merge({}, options)

    noteObj.keys = note.keys
    noteObj.duration = note.duration

    let vfNote

    const isTab = noteObj.clef && noteObj.clef==='tab'

    if (isTab) {

      //log('CREATE TAB NOTE', note, noteObj)

      noteObj.positions = note.positions || []

      vfNote = new Vex.Flow.TabNote(noteObj)

      // Tab note can have only one dot
      let numDots = Vex.Flow.parseNoteDurationString(note.duration).dots
      if (numDots) vfNote.addDot(0)

    } else {

      //log('CREATE NOTE', note, noteObj)

      vfNote = new Vex.Flow.StaveNote(noteObj)

      let i = 0
      if (note.accidentals instanceof Array)
        note.accidentals.forEach(function(acc) {
          if (acc != null) vfNote.addAccidental(i, new Vex.Flow.Accidental(acc))
          i++
        })

      let numDots = Vex.Flow.parseNoteDurationString(note.duration).dots
      for (let i = 0; i < numDots; i++) vfNote.addDotToAll()

    }

    if (note.stem_direction) noteObj.stem_direction = note.stem_direction

/*
    if (note.articulations) {
      if (note.articulations.accent || note.articulations.staccato) {

        // vexflow/tables.js 260
        const artic = new Vex.Flow.Articulation( note.articulations.accent ? 'a>' : 'a.')
        const pos = note.stem_direction && note.stem_direction==='up'
          ? 'below' : 'above'

        artic.setPosition(pos)

        // Argument order opposite for TabNote!
        if (isTab) vfNote.addModifier(artic, 0)
        else vfNote.addModifier(0, artic)
      }
    }
*/
    return vfNote
  }

  Vex.Flow.DocumentFormatter.prototype.getMinMeasureWidth = function(m) {

    if (m in this.minMeasureWidths) return this.minMeasureWidths[m]

    // Calculate the maximum extra width on any stave (due to modifiers)
    let maxExtraWidth = 0
    let measure = this.document.getMeasure(m)
    let vfStaves = measure.getStaves().map(function(stave) {

      let vfStave = this.createVexflowStave(stave, 0, 0, 500)
      let extraWidth = 500 - (vfStave.getNoteEndX()-vfStave.getNoteStartX())
      if (extraWidth > maxExtraWidth) maxExtraWidth = extraWidth

      return vfStave
    }, this)

    // Create dummy canvas to use for formatting (required by TextNote)
    let canvas = document.createElement("canvas")
    let context = Vex.Flow.Renderer.bolsterCanvasContext(
      canvas.getContext("2d")
    )

    let allVfVoices = []
    let startStave = 0 // stave for part to start on

    measure.getParts().forEach((part) => {
      let numStaves = part.getNumberOfStaves()
      let partStaves = vfStaves.slice(startStave, startStave + numStaves)
      part.getVoices().forEach((voice) => {

        //log('CHECK VOICE', voice)

        const allVoices = this.getVexflowVoice(voice, partStaves)
        const voices = [allVoices[0]]
        if (allVoices[2]) voices.push(allVoices[2]) // Include lyric voice

        allVfVoices.push(...voices)
        voices.forEach(v => {
          v.tickables.forEach((t) => t.setContext(context))
        })

      })
      startStave += numStaves
    })

    let formatter = new Vex.Flow.Formatter()
    let noteWidth = formatter.preCalculateMinTotalWidth(allVfVoices)

    // Find max tickables in any voice, add a minimum space between them
    // to get a sane min width

    let maxTickables = 0
    let hasLyrics // Used below for calculating measure height

    allVfVoices.forEach(function(v) {
      let numTickables = v.tickables.length
      if (numTickables) {
        v.tickables.forEach((t) => {
          if (!t.text) return
          // Add width for each letter in lyrics - TODO: Exact pixel widths?
          numTickables += (t.text.length / 4)
          hasLyrics = true
        })
      }

      if (numTickables > maxTickables) maxTickables = numTickables
    })

    this.minMeasureWidths[m] = Vex.Max(50,
      maxExtraWidth + noteWidth + maxTickables*20 + 10
    )


    // Heights

    // Calculate minMeasureHeight by merging bounding boxes from each voice
    // and the bounding box from the stave

    // TODO: this.options.inline

    let minHeights = []
    // Initialize to zero
    for (let i = 0; i < vfStaves.length + 1; i++) minHeights.push(0)

    let i=-1 // allVfVoices consecutive by stave, increment for each new stave
    let lastStave = null
    let staveY = vfStaves[0].getYForLine(0)
    let staveH = vfStaves[0].getHeight()
      //vfStaves[0].getYForLine(4) - staveY
      //vfStaves[0].getBottomY() - staveY // Original


    let lastBoundingBox = null

    allVfVoices.forEach(function(v) {
      if (v.stave !== lastStave) {
        if (i >= 0) {
          const lastY = lastBoundingBox.getY()
          minHeights[i]  += -lastY
          minHeights[i+1] =  lastBoundingBox.getH()+lastY
        }
        lastBoundingBox = new Vex.Flow.BoundingBox(0, staveY, 500, staveH)
        lastStave = v.stave
        i++
      }
      const bb = v.getBoundingBox()
      if (bb) lastBoundingBox.mergeWith(bb)
    })



    const lastY = lastBoundingBox.getY()

    minHeights[i]  += -lastY+(hasLyrics ? 50 : 0)
    minHeights[i+1] =  lastBoundingBox.getH()+lastY //+(hasLyrics ? 50 : 0)
    this.minMeasureHeights[m] = minHeights

    console.log(`Measure: ${m}, heights: `, ...minHeights, {
      minWidth: this.minMeasureWidths[m],
      minHeights: this.minMeasureHeights[m],
      measure,
      maxExtraWidth, noteWidth, maxTickables,
    })

    return this.minMeasureWidths[m]
  }

  Vex.Flow.DocumentFormatter.prototype.getMinMeasureHeight = function(m) {
    if (! (m in this.minMeasureHeights)) this.getMinMeasureWidth(m)
    return this.minMeasureHeights[m]
  }


  // Draw

  Vex.Flow.DocumentFormatter.prototype.drawPart = function(part, vfStaves, context) {

    let staves = part.getStaves()
    let voices = part.getVoices()

    vfStaves.forEach(function(stave) {
      stave.setContext(context).draw()
    })

    const allVfObjects = []
    const vfVoices = []
    const lyricVoices = []

    voices.forEach((voice) => {

      const [vfVoice, vfObjects, lyricVoice] = this.getVexflowVoice(voice, vfStaves)

      allVfObjects.push(...vfObjects)

      vfVoice.tickables.forEach((tickable) => {
        tickable.setStave(vfVoice.stave)
      })

      // Set tab note start X to the same as stave above it
      // This is needed because time signature is skipped
      if (vfVoice.stave.clef && vfVoice.stave.clef==='tab') {
        if (context._noteStartX) {
          vfVoice.stave.setNoteStartX(context._noteStartX)
        }
      }

      vfVoices.push(vfVoice)

      if (!lyricVoice) return

      lyricVoice.tickables.forEach((tickable) => {
        tickable.setStave(lyricVoice.stave)
      })
      vfVoices.push(lyricVoice)
      lyricVoices.push(lyricVoice)
    })

    // Format
    const formatter = new Vex.Flow.Formatter().joinVoices(vfVoices)
    formatter.format(vfVoices,
      vfStaves[0].getNoteEndX() - vfStaves[0].getNoteStartX() - 10
    )

    // Make adjustments based on formatted notes, modifiers

    let topY = 0
    vfVoices.forEach(v => {
      v.tickables.forEach(t => {
        const box = t.getBoundingBox() || {}
        const { y } = box
        //console.log('TICKABLE', t, box)
        if (y && (!topY || y < topY)) topY = y
      })
    })

    console.log('STAVE TOP Y', topY)


    // Draw voices

    vfVoices.forEach(function(vfVoice) {

      vfVoice.draw(context, vfVoice.stave)

      // Remember note X start/end for tab
      if (!vfVoice.stave.clef || vfVoice.stave.clef!=='tab') {
        context._noteStartX = vfVoice.stave.getNoteStartX()
      }
    })


    // After voices rendered

    // Draw objects
    allVfObjects.forEach(function(obj) {
      obj.setContext(context).draw()
    })

  } // drawPart


  // Options contains system_start, system_end for measure
  Vex.Flow.DocumentFormatter.prototype.drawMeasure =
  function (measure, vfStaves, context, options) {

    let startStave = 0
    let parts = measure.getParts()

    console.log('Draw measure', { measure, vfStaves, context, options })

    parts.forEach((part, partIndex) => {

      let numStaves = part.getNumberOfStaves()
      let partStaves = vfStaves.slice(startStave, startStave + numStaves)

      this.drawPart(part, partStaves, context)
      startStave += numStaves
    })


    this.document.getStaveConnectors().forEach((connector) => {

      if (! ((options.system_start && connector.system_start)
        || (options.system_end && connector.system_end)
        || connector.measure_start)) return

      let firstPart = connector.parts[0]
      let lastPart = connector.parts[connector.parts.length - 1]
      let firstStave, lastStave

        // Go through each part in measure to find the stave index
      let staveNum = 0, partNum = 0

      parts.forEach((part) => {
        if (partNum == firstPart) firstStave = staveNum
        if (partNum == lastPart)
          lastStave = staveNum + part.getNumberOfStaves() - 1
        staveNum += part.getNumberOfStaves()
        partNum++
      })

      if (isNaN(firstStave) || isNaN(lastStave)) return

      let type = connector.type == "single" ? Vex.Flow.StaveConnector.type.SINGLE
             : connector.type == "double" ? Vex.Flow.StaveConnector.type.DOUBLE
             : connector.type == "brace"  ? Vex.Flow.StaveConnector.type.BRACE
             : connector.type =="bracket"? Vex.Flow.StaveConnector.type.BRACKET
             : null

      const hasStart = connector.measure_start
        || (options.system_start && connector.system_start)

      if (hasStart && (connector.parts && connector.parts.length>1)) {

        // Start connector

        new Vex.Flow.StaveConnector(
          vfStaves[firstStave], vfStaves[lastStave]
        )
        .setType(type).setContext(context).draw()
      }

      /*if (options.system_end && connector.system_end) {

        let stave1 = vfStaves[firstStave], stave2 = vfStaves[lastStave]
        //let dummy1 = new Vex.Flow.Stave(stave1.x + stave1.width, stave1.y, 100)
        //let dummy2 = new Vex.Flow.Stave(stave2.x + stave2.width, stave2.y, 100)
        const c = new Vex.Flow.StaveConnector(stave1, stave2) //dummy1, dummy2

        log('CONNECTOR END', connector, c)

        c.setType(type).setXShift(stave1.getWidth()).setContext(context).draw()
      }*/
    })
  }

  // Liquid.draw -->

  Vex.Flow.DocumentFormatter.prototype.drawBlock = function(b, context) {

    this.getBlock(b)

    let measures = this.measuresInBlock[b]

    measures.forEach((m) => {

      let stave = 0
      while (this.getStave(m, stave)) stave++

      const meaureOptions = {
        system_start: m == measures[0],
        system_end: m == measures[measures.length - 1]
      }

      this.drawMeasure(
        this.document.getMeasure(m),
        this.vfStaves[m],
        context,
        meaureOptions
      )
    })
  }

  return Vex
}
