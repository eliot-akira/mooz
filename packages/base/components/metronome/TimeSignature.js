import { C, Block, Input } from 'core'

const timeSignatures = ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8']

export default C({

  render({ state, actions }) {

    const { timeSignature } = state.mooz
    const { beats, unit } = timeSignature

    return (
      <Block>
        <Input {...{
          type: 'select',
          options: timeSignatures.map(t => ({ value: t, label: t.split('/').join(' / ') })),
          value: `${beats}/${unit}`,
          onChange: e => actions.mooz.setTimeSignature(e.target.value)
        }} />

      </Block>
    )
  }
})
