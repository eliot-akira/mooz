import api from 'base/api'
import mooz from '../base'

const log = require('base/log')('mooz/sounds/request',
  false // (...args) => console.log(...args)
)

export default async function requestSoundJson(soundPath) {

  log('Request JSON', soundPath)

  const res =  await api.get(soundPath)

  log('Loaded sounds JSON', Object.keys(res))

  return res
}
