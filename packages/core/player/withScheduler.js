import mooz from '../mooz'

const log = require('core/log')('mooz/player/withScheduler', (...args) => console.log(...args))

export default function withScheduler(schedule, player) {

  if (!player) {
    return log.error('Schedule needs a player')
  }

  if (!Array.isArray(schedule)) {
    return log.error('Schedule must be an array of event objects')
  }

  if (!player.schedule) {
    log('Set first schedule', player.name, schedule)
  } else {
    log('Set next schedule', player.name, schedule)
  }

  player.schedule = schedule

  if (player.scheduler) player.scheduler.dispose()

  player.scheduler = mooz.createScheduler(({ time, event, position, onTime }) => {

    // Called for each note in schedule

    if (event.note && player.audioPlayer) {

      const { note, offset = 0, duration } = event

      player.play(note, time, offset, duration)
    }

    onTime(() => {
      const data = { event, position, player }
      mooz.emit('play', data)
      player.emit('play', data)
      if (player.callback) player.callback(data)
    })

  }, schedule)

  // Player shortcuts

  player.getProgress = () => player.scheduler.progress // Only when using loop


  // Offset

  player.setOffset = (offset = 0) => {
    player.scheduler.start(offset)
  }

  player.setOffset(player.offset) // Start at a given time


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