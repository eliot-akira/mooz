import { Button, Icon } from 'core'
import Dots from './Dots'

const Loading = () => <Button><Icon name="spinner" spin /></Button>

const Controls = ({ mode = 'mini', state, actions }) => {

  const {
    isLoaded, isPlaying, isPaused, isStopped
  } = state.mooz
  const {
    start, pause, stop,
    backBar, backBeat,
    forwardBar, forwardBeat
  } = actions.mooz

  return (

    <Button.Group buttons={[
      ...(mode!=='full' ? [] : [
        { disabled: !isLoaded,
          onClick: backBar,
          icon: 'step-backward'
        },
        { disabled: !isLoaded,
          onClick: backBeat,
          icon: 'backward'
        },
      ]),

      !isLoaded

        ? { disabled: true,
          icon: { name:'spinner', spin: true }
        }
        : (!isPlaying
            ? {
              onClick: start,
              icon: 'play',
              autoFocus: true
            } : (!isPaused ? {
              onClick: pause,
              icon: 'pause'
            } : null)
          )
      ,
      { disabled: !isLoaded,
        onClick: stop,
        icon: 'stop'
      },

      ...(mode!=='full' ? [] : [
        { disabled: !isLoaded,
          onClick: forwardBeat,
          icon: 'forward'
        },
        { disabled: !isLoaded,
          onClick: forwardBar,
          icon: 'step-forward'
        },
      ]),

      { disabled: !isLoaded,
        //fullWidth: true, expanded: true,
        plain: true,
        content: <Dots {...{ state, actions }} />
      },

    ].filter(b => b ? true : false)}>
    </Button.Group>

  )
}


export default Controls
export { Loading }