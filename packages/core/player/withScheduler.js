import mooz from '../base'
import { playerOffset } from '../constants'

const log = require('core/log')('mooz/player/withScheduler',
  false //(...args) => console.log(...args)
)

export default function withScheduler({ schedule, player }, { actions }) {

  if (!player) {
    return log.error('Schedule needs a player')
  }

  player.setSchedule = newSchedule => {

    log(`${!player.schedule?'First':'Next'} schedule`, player.name, newSchedule)

    player.schedule = newSchedule

    if (player.scheduler) {
      //player.scheduler.dispose()
      player.scheduler.removeAll()
      newSchedule.forEach(event => {
        player.scheduler.add(event.time, event)
      })
      player.setLoop(player)
      return
    }

    player.scheduler = actions.createScheduler({
      schedule: newSchedule,
      // Called for each event in schedule
      callback: ({ when, duration, position, event, onTime }) => {

        // Pass notes
        if (player.play) player.play({ ...event,
          when, duration
        })

        if (player.callback) onTime(() => {
          const data = { event, position, player }
          //mooz.emit('play', data)
          //player.emit('play', data)
          //if (player.callback)
          player.callback(data)
        })
      }
    })
  }

  player.setSchedule(schedule)

  // Player shortcuts

  player.getProgress = () => player.scheduler.progress // Only when using loop


  // Offset

  player.setOffset = (offset = playerOffset) => {
    player.scheduler.start(offset)
  }

  player.setOffset(player.offset)


  // Loop

  const defaultLoopOptions = {
    loop: false,
    loopEnd: '1m',
    loopStart: 0
  }

  player.setLoop = (options) => {

    /*log('Loop options', Object.keys(defaultLoopOptions).reduce((obj, key) => {
      obj[key] = typeof options[key]==='undefined' ? defaultLoopOptions[key] : options[key]
      return obj
    }, {}))*/

    Object.keys(defaultLoopOptions).forEach(key => {
      if (typeof options[key]==='undefined') return
      player.scheduler[key] = options[key]
    })
  }
  player.clearLoop = () => player.setLoop(defaultLoopOptions)

  player.setLoop(player)


  //log.info('With scheduler', player)

  return player
}