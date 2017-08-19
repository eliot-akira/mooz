import mooz from '../../base'
import getWorker from './getWorker'
import getMicrophone from './getMicrophone'
import interpret from './interpret'
import onEvent from './onEvent'

let worker, mic

export async function createTuner(props) {

  const { onResult }= props

  const audioContext = mooz.context

  worker = getWorker({
    onMessage: event => interpret({
      event,
      onResult
    })
  })

  mic = await getMicrophone({
    audioContext,
    onEvent: event => onEvent({ event, audioContext, worker })
  })

}

export async function removeTuner() {
  if (worker && worker.finish) worker.finish()
  if (mic && mic.finish) mic.finish()
}

