import { C } from 'core'
import initArray from '../../../util/initArray'
import style from './style'

export default C({

  state: {
    active: false,
    beat: 1
  },

  render({ state, actions }) {

    const { timeSignature } = state.mooz
    const { beats, unit } = timeSignature
    const isActive = this.state.active
    const currentBeat = this.state.beat

    const percent = 100 / beats
    const width = `${percent}%`

    return (
      <div className="root">
        { initArray(beats).map((beat, index) =>
          <div key={index} className="beat" style={{
            width
          }}>
            <div className="circle"
              style={{
                backgroundColor:
                  (index+1)===currentBeat ? 'yellow'
                  : isActive ? '#eee' : 'transparent'
              }}
            >
              { isActive ? index+1 : null }
            </div>
          </div>
        )}

        <style jsx>{style}</style>
      </div>
    )
  },


  display(data) {
    if (this.mounted) this.setState(data)
  },

  didMount({ actions }) {

    this.mounted = true

    actions.app.ready(() => {

      console.log('Dots subscribe')
      this.unsubscribe = actions.mooz.on({
        event: 'metronome',
        callback: this.display
      })
      this.setState({ active: true })
    })
  },

  willUnmount() {
    this.mounted = false
    if (this.unsubscribe) {
      console.log('Dots unsubscribe')
      this.unsubscribe()
    }
  },
})
