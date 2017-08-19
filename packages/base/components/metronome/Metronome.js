import { C, Block, Input } from 'core'
import Controls from './Controls'
import Position from './Position'
import Tempo from './Tempo'
import TimeSignature from './TimeSignature'

export default C({

  name: 'Metronome',

  render(props) {

    return (
      <Block>

        <Controls {...props} />
        <Position {...props} />
        <Tempo {...props} />

        <TimeSignature {...props} />

      </Block>
    )
  },
})

//
