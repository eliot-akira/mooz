import initUserMedia from './initUserMedia'

let finish

export default async function getMicrophone({ audioContext, onEvent }) {

  if (finish) finish()

  const getUserMedia = initUserMedia()

  const stream = await getUserMedia({ audio: true })

  console.log('Use stream', stream)

  const microphone = audioContext.createMediaStreamSource(stream)

  // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
  window.source = microphone

  const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1)

  scriptProcessor.connect(audioContext.destination)
  microphone.connect(scriptProcessor)

  // Prevent being garbage-collected
  // http://lists.w3.org/Archives/Public/public-audio/2013JanMar/0304.html
  window.captureAudio = onEvent

  scriptProcessor.onaudioprocess = window.captureAudio

  finish = () => {

    console.log('Close microphone')

    stream.getTracks().forEach(t => t.stop())

    scriptProcessor.onaudioprocess = null
    scriptProcessor.disconnect(audioContext.destination)
    microphone.disconnect(scriptProcessor)
    finish = null
    // audioContext.close()
  }

  return { finish }
}
