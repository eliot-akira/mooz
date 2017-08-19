import { C } from 'base'

const log = require('base/log')('mooz/components/notation',
  //false
  (...args) => console.log(...args)
)

export default C({

  name: 'Notation',

  render() {
    return (
      <div className="notation" ref={el => this.el = el} />
    )
  },

  didMount({ id = '', xml, score, onReady, mooz }) {

    this.load({ id, xml, score, onReady, mooz })

    // Responsive
    const resizer = () => {
      if (this.timer || !this.el || !this.draw) return
      this.timer = setTimeout(() => {

        //log('resize')

        this.draw()
        this.timer = null
      }, 300)
    }

    window.addEventListener('resize', resizer)
    this.unsubscribe = () => window.removeEventListener('resize', resizer)
  },

  willUnmount() {
    if (this.unsubscribe) this.unsubscribe()
    this.draw = this.unsubscribe = null
  },


  load(props) {

    const { id = '', xml, score, onReady, mooz } = props

    //log('LOAD', props, this.score)

    this.scoreId = id
    this.score = mooz.actions.createNotation({
      element: this.el,
      xml, score
    })

    // Expose score instance on the element
    this.el._score = this.score

    // Redraw
    this.draw = (...args) => this.score.draw(...args)

    if (onReady) onReady(this.score)
  },

  shouldUpdate(props) {

    const { id, xml, score, onReady, mooz, nextProps, prevProps } = props

    //log('shouldUpdate', props)

    const doRender = !id || !this.scoreId || id!==this.scoreId

    if (doRender) {

      this.load({ id, xml, score, onReady, mooz })

    }

    return false
  }
})
