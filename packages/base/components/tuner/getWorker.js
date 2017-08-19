import { tunerWorkerURL } from './constants'

let tunerWorker
let finish

export default function getTunerWorker({ onMessage }) {

  if (!tunerWorker) {
    console.log('Load tuner worker')
    tunerWorker = new Worker(tunerWorkerURL)
  } else if (finish) finish()

  console.log('Subscribe to worker')
  tunerWorker.addEventListener('message', onMessage)

  const postMessage = tunerWorker.postMessage.bind(tunerWorker)

  finish = () => {
    console.log('Unsubscribe from worker')
    tunerWorker.removeEventListener('message', onMessage)
    finish = null
  }

  return { postMessage, finish }
}
