import api from 'core/api'
import mooz from '../mooz'

const log = require('core/log')('mooz/sounds/request', (...args) => console.log(...args))

export default async function requestSoundJson(soundPath) {

  log('Request JSON', soundPath)

  const res =  await api.get(soundPath)

  log('Loaded sounds JSON', Object.keys(res))

  return res
}
