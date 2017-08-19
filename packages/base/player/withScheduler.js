import mooz from '../base'
import { playerOffset } from '../constants'

const log = require('base/log')('mooz/player/withScheduler',
  false
  //(...args) => console.log(...args)
)

export default function withScheduler({ schedule, player }, { actions }) {

  if (!player) {
    return log.error('Schedule needs a player')
  }

  // Player methods

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

    // Event callback

    player.scheduler = actions.createScheduler({
      schedule: newSchedule,
      callback: ({ when, duration, position, event, onTime }) => {

        // Pass notes
        if (player.play) player.play({ ...event,
          when, duration
        })

        onTime(() => {

          const data = {
            event,
            position,
            player: player.name,
            duration // In seconds
          }

          mooz.emit('play', data)
          player.emit('play', data)

          if (player.callback) player.callback(data)
        })
      }
    })

    player.emit('schedule', newSchedule)
  }

  player.getProgress = () => player.scheduler.progress // Only when using loop

  // Offset

  player.setOffset = (offset = playerOffset) => {
    player.scheduler.start(offset)
  }

  // Loop

  const defaultLoopOptions = {
    loop: false,
    loopEnd: '1m',
    loopStart: 0
  }

  player.setLoop = (options) => {
    Object.keys(defaultLoopOptions).forEach(key => {
      if (typeof options[key]!=='undefined') {
        player.scheduler[key] = options[key]
        return
      }
      if (typeof player.scheduler[key]==='undefined') {
        player.scheduler[key] = defaultLoopOptions[key]
      }
    })
  }

  player.clearLoop = () => player.setLoop(defaultLoopOptions)

  // Init

  player.setSchedule(schedule)
  player.setOffset(player.offset)
  player.setLoop(player)


  //log.info('With scheduler', player)

  return player
}