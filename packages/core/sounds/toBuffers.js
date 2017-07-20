import base64decode from '../util/base64decode'
import mooz from '../base'

const log = require('core/log')('mooz/sounds/toBuffers',
  false // (...args) => console.log(...args)
)

export default async function jsonToBuffers(json) {

  const buffers = {}

  await Promise.all(Object.keys(json).map(async key => {

    buffers[key] = await base64toBuffer(json[key])

    //log('Decoded audio', key, buffers[key])
  }))

  log('Result buffers', buffers)

  return buffers
}

function base64toBuffer(base64) {

  const decoded = base64decode(base64)

  // @deprecated MIDI.js format with dataURL prefix
  //let i = base64.indexOf(',')
  //const decoded = base64decode(base64.slice(i + 1))

  return new Promise((resolve, reject) => {

    mooz.context.decodeAudioData(decoded.buffer, buffer => {
      resolve(buffer)
    })
  })
}
