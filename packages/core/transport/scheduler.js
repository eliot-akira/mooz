import mooz from '../mooz'

/**
 * Schedule render on time
 */
export const onTime = mooz.tone.Draw.schedule.bind(mooz.tone.Draw)
  /*(callback, time) => {
    const now = mooz.context.currentTime
    const diff = time > now ? time - now : 0
    setTimeout(callback, diff / 1000)
  }*/


export const createScheduler = (callback, schedule) => {
  return new mooz.tone.Part((time, event) => {

    const position = mooz.getPosition()

    callback({
      time,
      event,
      position,
      onTime: fn => onTime(fn, time)
    })

  }, schedule)
}
