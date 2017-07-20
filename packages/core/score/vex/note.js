
export default function createNote(props) {

  // B5 or lower -> stem down by default

  const note = {
    type: 'note',
    keys: [
      'C/4'
    ],
    // Must have same length as keys
    accidentals: [
      null
    ],
    /*positions: [
      {
        str: '2',
        fret: '1'
      }
    ],*/
    duration: '8d', // 8d
    rest: false,
    tuplet: null,
    stem_direction: -1,
    beam: null, // begin, end..
    tie: null,
    lyric: null
  }




  return note
}
