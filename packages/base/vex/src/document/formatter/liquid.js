module.exports = function(Vex) {

  const log = (...args) =>
    Vex.Flow.DocumentFormatter.Liquid.DEBUG
    ? console.log('Vex.Flow.DocumentFormatter.Liquid', args)
    : null

  /**
   * Vex.Flow.DocumentFormatter.prototype.draw - defined in subclass
   * Render document inside HTML element, creating canvases, etc.
   * Called a second time to update as necessary if the width of the element
   * changes, etc.
   * @param {Node} HTML node to draw inside
   * @param {Object} Subclass-specific options
   */

  /**
   * Vex.Flow.DocumentFormatter.Liquid - default liquid formatter
   * Fit measures onto lines with a given width, in blocks of 1 line of music
   *
   * @constructor
   */
  Vex.Flow.DocumentFormatter.Liquid = function(document, options) {

    Vex.Flow.DocumentFormatter.call(this, document, options)

    this.width = 500
    this.zoom = 1
    this.scale = 1

    // TODO: Test scaling

    if (typeof window.devicePixelRatio == "number"
      && window.devicePixelRatio > 1) {
      this.scale = Math.floor(window.devicePixelRatio)
    }
  }

  Vex.Flow.DocumentFormatter.Liquid.DEBUG = false

  Vex.Flow.DocumentFormatter.Liquid.prototype = new Vex.Flow.DocumentFormatter()

  Vex.Flow.DocumentFormatter.Liquid.constructor =
    Vex.Flow.DocumentFormatter.Liquid

  Vex.Flow.DocumentFormatter.Liquid.prototype.setWidth = function(width) {
    this.width = width
    return this
  }


  Vex.Flow.DocumentFormatter.Liquid.prototype.getBlock = function(b, options = {}) {

    if (b in this.blockDimensions) return this.blockDimensions[b]

    let startMeasure = 0
    if (b > 0) {
      this.getBlock(b - 1)
      let prevMeasures = this.measuresInBlock[b - 1]
      startMeasure = prevMeasures[prevMeasures.length - 1] + 1
    }
    let numMeasures = this.document.getNumberOfMeasures()
    if (startMeasure >= numMeasures) return null


    // Default modifiers for first measure

    const defaultModifiers = ['clef', 'time', 'key']

    const modifiersPerStave = this.document
      .getMeasure(startMeasure)
      .getStaves()
      .map(s => defaultModifiers.reduce((obj, key) => {
        obj[key] = s[key]
        s.addDefaultModifiers()
        return obj
      }, {})
      )

    // Store x, width of staves (y calculated automatically)
    if (! this.measureX) this.measureX = []
    if (! this.measureWidth) this.measureWidth = []

    // Calculate start x
    let start_x = 0

    // Add space for braces

    const parts = this.document.getMeasure(startMeasure).getParts()
    if (parts.length > 1) start_x = 15
    parts.forEach((part) => {
      if (part.showsBrace()) start_x = 15
    })

    let endMeasure = startMeasure

    const endPad = 10

    const minMeasureWidth = this.getMinMeasureWidth(startMeasure)
       + start_x + endPad

    if (minMeasureWidth >= this.width) {

      // Use only this measure and the minimum possible width
      let block = [minMeasureWidth, 0]
      this.blockDimensions[b] = block
      this.measuresInBlock[b] = [startMeasure]
      this.measureX[startMeasure] = start_x
      this.measureWidth[startMeasure] = block[0] - start_x - endPad

    } else {

      let curMeasure = startMeasure
      let width = start_x + endPad

      //log('CHECK MIN WIDTH', width, this.width)

      const isSame = (val1, val2) => {
        if (typeof val1==='string') return val1===val2
        let same = true
        Object.keys(val1).forEach(k => {
          if (val1[k]!==val2[k]) same = false
        })
        return same
      }

      while (width < this.width && curMeasure < numMeasures) {

        // Remove automatic modifiers except for first measure
        // If there were any, invalidate the measure width
        if (curMeasure != startMeasure) {

          let keepDefaultModifier = {}

          this.document.getMeasure(curMeasure).getStaves().forEach((s, staveIndex) => {

            // Decide whether to keep: only if different from previous
            defaultModifiers.forEach(key => {
              if (!s[key]) return
              const inherit = modifiersPerStave[staveIndex][key]
              if (!inherit || !isSame(inherit, s[key])) {
                modifiersPerStave[staveIndex][key] = s[key]
                keepDefaultModifier[key] = true
                //log('KEY IS DIFFERENT', curMeasure, staveIndex, key, inherit, s[key])
              } else {
                keepDefaultModifier[key] = false
                //log('KEY IS SAME', curMeasure, staveIndex, key, inherit, s[key])
              }
            })

            defaultModifiers.forEach(key =>
              !keepDefaultModifier[key] && s.deleteModifier(key)
            )
            //log('DELETE MODIFIERS BEFORE', curMeasure, ...s.modifiers)

            if (s.deleteAutomaticModifiers()
              && this.minMeasureWidths
              && curMeasure in this.minMeasureWidths
            ) {
              delete this.minMeasureWidths[curMeasure]
            }

          })
        }

        width += this.getMinMeasureWidth(curMeasure)
        curMeasure++
      }

      endMeasure = curMeasure - 1

      let measureRange = []
      for (let m = startMeasure; m <= endMeasure; m++) measureRange.push(m)
      this.measuresInBlock[b] = measureRange

      // Allocate width to measures
      let remainingWidth = this.width - start_x - 10
      for (let m = startMeasure; m <= endMeasure; m++) {
        // Set each width to the minimum
        this.measureWidth[m] = Math.ceil(this.getMinMeasureWidth(m))
        remainingWidth -= this.measureWidth[m]
      }

      // Split rest of width evenly
      let extraWidth = Math.floor(remainingWidth / (endMeasure-startMeasure+1))
      for (let m = startMeasure; m <= endMeasure; m++)
        this.measureWidth[m] += extraWidth
      remainingWidth -= extraWidth * (endMeasure - startMeasure + 1)
      this.measureWidth[startMeasure] += remainingWidth // Add remainder

      // Calculate x value for each measure
      this.measureX[startMeasure] = start_x
      for (let m = startMeasure + 1; m <= endMeasure; m++)
        this.measureX[m] = this.measureX[m-1] + this.measureWidth[m-1]
      this.blockDimensions[b] = [this.width, 0]
    }


    // Calculate height of first measure

    let i = 0
    let lastStave = undefined
    let stave = this.getStave(startMeasure, 0)
    while (stave) {
      lastStave = stave
      i++
      stave = this.getStave(startMeasure, i)
    }

    let height = this.getStaveY(startMeasure, i-1)

    // Add max extra space for last stave on any measure in this block
    // Default: minimum height of stave // was 90

    // TODO: this.options.inline

    let maxExtraHeight = 60 // NOTE: Adds bottom pad

    for (let i = startMeasure; i <= endMeasure; i++) {
      let minHeights = this.getMinMeasureHeight(i)
      let extraHeight = minHeights[minHeights.length - 1]
      if (extraHeight > maxExtraHeight) maxExtraHeight = extraHeight
    }
    height += maxExtraHeight
    this.blockDimensions[b][1] = height

    console.log('getBlock', b, {
      maxExtraHeight,
      staveY: this.getStaveY(startMeasure, i-1),
      width: this.blockDimensions[b][0],
      height: this.blockDimensions[b][1]
    })

    return this.blockDimensions[b]
  }

  Vex.Flow.DocumentFormatter.Liquid.prototype.getStaveX = function(m, s) {
    if (! (m in this.measureX))
      throw new Vex.RERR("FormattingError",
                "Creating stave for measure which does not belong to a block")
    return this.measureX[m]
  }

  Vex.Flow.DocumentFormatter.Liquid.prototype.getStaveWidth = function(m, s) {
    if (! (m in this.measureWidth))
      throw new Vex.RERR("FormattingError",
                "Creating stave for measure which does not belong to a block")
    return this.measureWidth[m]
  }


  Vex.Flow.DocumentFormatter.Liquid.prototype.draw = function(elem, options = {}) {

    if (this._htmlElem != elem) {
      this._htmlElem = elem
      elem.innerHTML = ''
      this.canvases = []
    }


    const scale = options.scale || this.scale || 1
    const zoom = options.zoom || this.zoom || 1

    let canvasWidth = options.inline ? 0 : elem.offsetWidth //- 10
    let renderWidth = Math.floor(canvasWidth / zoom)


    //console.log('START DRAW', { elem, options, canvasWidth, renderWidth, zoom })

    // Invalidate all blocks/staves/voices
    this.minMeasureWidths = [] // heights don't change with stave modifiers
    this.measuresInBlock = []
    this.blockDimensions = []
    this.vfStaves = []
    this.measureX = []
    this.measureWidth = []
    this.setWidth(renderWidth)


    // TODO: Refactor to use a single canvas element for all blocks

    // Remove all non-canvas child nodes of element
    /*
    const children = elem.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.nodeName === 'CANVAS') continue
      elem.removeChild(child)
    }*/

    let b = 0
    while (this.getBlock(b, options)) {

      let canvas, context
      let dims = this.blockDimensions[b]
      let width = Math.ceil(dims[0] * zoom)
      let height = Math.ceil(dims[1] * zoom)

      if (! this.canvases[b]) {

        // Create new canvas for this block

        canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale

        if (scale > 1) {
          canvas.style.width = width.toString() + "px"
          canvas.style.height = height.toString() + "px"
        }
        canvas.id = elem.id + "_canvas" + b.toString()

        // If a canvas exists after this one, insert before that canvas
        /*for (let a = b + 1; this.getBlock(a); a++) {
          if (typeof this.canvases[a] == "object") {
            elem.insertBefore(canvas, this.canvases[a])
            break
          }
        }*/

        if (! canvas.parentNode) {
          elem.appendChild(canvas) // Insert at the end of elem
        }

        this.canvases[b] = canvas
        context = Vex.Flow.Renderer.bolsterCanvasContext(canvas.getContext("2d"))

      } else {

        canvas = this.canvases[b]
        canvas.style.display = "inherit"
        canvas.width = width * scale
        canvas.height = height * scale

        if (scale > 1) {
          canvas.style.width = width.toString() + "px"
          canvas.style.height = height.toString() + "px"
        }

        context = Vex.Flow.Renderer.bolsterCanvasContext(canvas.getContext("2d"))
        context.clearRect(0, 0, canvas.width, canvas.height)
      }

      // TODO: Figure out why setFont method is called
      if (typeof context.setFont != "function") {
        context.setFont = function(font) { this.font = font; return this }
      }

      context.scale(zoom * scale, zoom * scale)

      /*console.log('Call draw block', b, {
        canvasWidth, renderWidth,
        scale, zoom, totalScale: scale * zoom,
        height: height * scale,
        width: width * scale
      })*/

      this.drawBlock(b, context) // --> formatter.drawBlock

      // Add anchor elements before canvas
      /*let lineAnchor = document.createElement("a")
      lineAnchor.id = elem.id + "_line" + (b+1).toString()
      elem.insertBefore(lineAnchor, canvas)

      this.measuresInBlock[b].forEach(function(m) {
        let anchor = elem.id + "_m" +
                   this.document.getMeasureNumber(m).toString()
        let anchorElem = document.createElement("a")
        anchorElem.id = anchor
        elem.insertBefore(anchorElem, canvas)
      }, this)
      */
      b++
    }

    // Remove canvases beyond last
    while (typeof this.canvases[b] == "object") {
      elem.removeChild(this.canvases[b])
      delete this.canvases[b]
      b++
    }
  }

}