import requestSoundJson from './request'
import jsonToBuffers from './toBuffers'
import mooz from '../base'

const log = require('base/log')('mooz/sounds/loadSounds', (...args) => console.log(...args))

export async function loadSounds({ soundPath }) {

  if (mooz.sounds[soundPath]) {
    log.ok('Already loaded', soundPath)
    return mooz.sounds[soundPath]
  }

  const data = await jsonToBuffers(
    await requestSoundJson(soundPath)
  )

  mooz.sounds[soundPath] = data

  return data
}
