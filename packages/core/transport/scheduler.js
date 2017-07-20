import mooz from '../base'

const log = require('core/log')('mooz/transport/scheduler',
  (...args) => console.log(...args)
)

/**
 * Call event on time in seconds
 */
const onTime = (callback, time) =>
  mooz.tone.Draw.schedule.call(mooz.tone.Draw, callback, time)
  /*(callback, time) => {
    const now = mooz.context.currentTime
    const diff = time > now ? time - now : 0
    setTimeout(callback, diff / 1000)
  }*/

export const createScheduler = ({ callback, schedule }, { actions }) => {

  if (!schedule || !Array.isArray(schedule)) {
    return log.error('Schedule must be an array of event objects')
  }

  const { getPosition } = actions

  return new mooz.tone.Part((when, event = {}) => {

    const position = getPosition()

    // Convert duration to seconds
    const duration = event.duration
    ? mooz.time(event.duration).toSeconds()
    : 0 // Play the whole length of audio buffer

    callback({
      when, duration, position,
      event,
      onTime: fn => onTime(fn, when)
    })

  }, schedule)
}
