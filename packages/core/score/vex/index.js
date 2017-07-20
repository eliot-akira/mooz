import createDocumentFromScore from './create'
import documentToObject from './documentToObject'

module.exports = function(Vex) {

  class Score {

    constructor(props = {}) {

      const {
        xml,
        element,
        options = {},
        parts
      } = props

      this.document = Vex.createDocument(
        xml || createDocumentFromScore({ parts })
      )

      this.options = {
        inline: false,
        zoom: .9,
        ...options
      }

      this.formatter = this.document.getFormatter(this.options)

      this.element = element

      if (this.element) {
        if (this.options.inline) {
          this.element.style.display = 'inline-block'
          this.element.style.verticalAlign = 'middle'
        }
        this.draw()
      }

      console.log('CREATE SCORE', props, this)
    }

    getScore() {
      return documentToObject(this.document)
    }

    load(props) {

      const {
        options,
        parts
      } = props

      if (parts) this.document.init(
        createDocumentFromScore({ parts })
      )
      if (options) this.options = { ...this.options, ...options }
      this.draw()
    }

    draw(props = {}) {

      const {
        element = this.element,
        options
      } = props

      if (!this.element) {
        return console.error('Score.draw needs an element')
      }

      this.formatter.draw(this.element, {
        ...this.options,
        ...options
      })
    }
  }

  Vex.Score = Score
  Vex.createScore = props => new Score(props)
  Vex.createDocument = props => new Vex.Flow.Document(props)

  return Vex
}


/*
function isMusicXML(str) {
  return str.search(/<score-partwise/i) != -1
}
*/