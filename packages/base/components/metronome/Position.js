import { C, Block } from 'core'

export default C({
  state: {
    bar: 1, beat: 1
  },
  render() {
    const { bar, beat } = this.state
    return (
      <Block>{`Bar: ${bar} - Beat: ${beat}`}</Block>
    )
  },
  display(data) {
    if (this.mounted) this.setState(data)
  },
  didMount({ actions }) {
    this.mounted = true
    actions.app.ready(() => {
      console.log('Position subscribe')
      this.unsubscribe = actions.mooz.on({
        event: 'metronome',
        callback: this.display
      })
    })
  },
  willUnmount() {
    this.mounted = false
    if (this.unsubscribe) {
      console.log('Position unsubscribe')
      this.unsubscribe()
    }
  }
})

