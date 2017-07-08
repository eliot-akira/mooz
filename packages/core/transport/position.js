import mooz from '../mooz'

export const getPosition = () => {

  const position = mooz.transport.position
  const [ bar, beat, sixteenth ] = position.split(':')

  const progress = mooz.transport.progress // 0~1 with loop
  const seconds = mooz.transport.seconds
  const bpm = mooz.transport.bpm.value

  // What about tempo change..?
  const beatIndex = seconds * (bpm / 60) // 60 BPM: 1 sec = 1 beat

  //const ticks = mooz.transport.ticks

  return {
    bpm,
    beatIndex,
    display: position,
    bar: parseInt(bar, 10),
    beat: parseInt(beat, 10),
    sixteenth: parseInt(sixteenth, 10),
    seconds,
    progress,
    //ticks,
    // time signature
  }
}

export const setPosition = (pos) => {

  // Seconds or bars:beats:sixteenths

  mooz.transport.position = pos
}
