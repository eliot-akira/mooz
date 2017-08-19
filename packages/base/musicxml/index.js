import { api } from 'base'
import mooz from '../base'

const log = require('base/log')('mooz/musicxml',
//false
  (...args) => console.log(...args)
)

// TODO: Modularize file requests with cache

export function loadMusicXML({ src }, { setState, actions }) {
  return new Promise((resolve, reject) => {

    const done = data => {
      mooz.xml[src] = data
      resolve(data)
    }

    const cached = mooz.xml[src]
    if (cached) {
      if (cached.wait) cached.wait.push(done)
      else done(cached)
      return
    }

    mooz.xml[src] = { wait: [] }
    api.get(src).then((data) => {

      //log.success('Loaded', src)

      // Callbacks waiting
      mooz.xml[src].wait.forEach(p => p(data))
      mooz.xml[src] = data
      done(data)

    }).catch(e => {
      console.error(e)
    })
  })
}
