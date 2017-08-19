/**
 *  Parse tempo and time signature from the midiJson
 *  @param  {Object}  midiJson
 *  @return  {Object}
 */
function parseHeader(midiJson){

  const ret = {
    PPQ : midiJson.header.ticksPerBeat
  }

  for (let i = 0; i < midiJson.tracks.length; i++){
    let track = midiJson.tracks[i]
    for (let j = 0; j < track.length; j++){
      let datum = track[j]
      if (datum.type === "meta"){
        if (datum.subtype === "timeSignature"){
          ret.timeSignature = [datum.numerator, datum.denominator]
        } else if (datum.subtype === "setTempo"){
          if (!ret.bpm){
            ret.bpm = 60000000 / datum.microsecondsPerBeat
          }
        }
      }
    }
  }
  ret.bpm = ret.bpm || 120
  return ret
}

export { parseHeader }
