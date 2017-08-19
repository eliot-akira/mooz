
// MIDI message

const messageNumberToType = {
  // index = Math.floor(number / 16)
  // http://www.earlevel.com/main/1996/08/14/midi-overview/
	8: 'OFF', //NOTE_OFF
	9: 'ON', //NOTE_ON
	10: 'PRESSURE_POLY',
	11: 'CONTROL', // MODE_CHANGE
	12: 'PROGRAM', // PROGRAM_CHANGE
	13: 'PRESSURE',
	14: 'PITCH' //PITCH_BEND
}

let messageTypeToNumber = {}

for (let number in messageNumberToType) {
  messageTypeToNumber[ messageNumberToType[number] ] = number
}

export function getMessageType(data) {
  let message = data[0]
  let velocity = data[2]
  let number = velocity > 0 ? Math.floor(message/16) : 8 // OFF if velocity is 0
  return messageNumberToType[number] || 'UNKNOWN'
}

export function createMessageArray({ message, channel, note, velocity = 0 }) {
  if (!messageTypeToNumber[message]) {
    console.error('[Midi] Unknown message type', message)
    return
  }

  let number = (messageTypeToNumber[message] * 16)+channel

  return [number, note, velocity]
}
