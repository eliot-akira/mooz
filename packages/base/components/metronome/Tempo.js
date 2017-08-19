import { C, Block, Input } from 'core'

export default C({

  render({ state, actions }) {

    const { tempo } = state.mooz

    return (
      <Block>
        <div className="field">
          <div className="control">
            <div className="tempo">{ tempo } beats per minute</div>
          </div>
          <div className="control is-expanded">

        <Input type="range" min="40" max="200" value={tempo}
          onChange={e => {
            const { value } = e.target

            //console.log('RANGE', value)

            actions.mooz.setTempo(value)

          /*if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(()=> {
            actions.mooz.setTempo(value)
            this.timer = null
          }, 100)*/
          }}/>

          </div>
        </div>

      </Block>
    )
  },
})

