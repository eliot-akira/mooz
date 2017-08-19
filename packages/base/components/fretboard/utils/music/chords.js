
/*---------------------------------------------
 *
 * Chords
 *
 */

export const CHORDS = {

  major: [ 4, 3, 5 ],
  minor: [ 3, 4, 5 ],
  diminished: [ 3, 3, 3, 3 ],
  augmented: [ 4, 4, 4 ],

  _: "",

  "major 7th": [ 4, 3, 4, 1 ],
  "minor 7th": [ 4, 4, 3, 1 ],
  "dominant 7th": [ 4, 3, 3, 2 ],
  "diminished 7th": [ 3, 3, 3, 3 ],
  "half-diminished 7th": [ 3, 3, 4, 2 ],
  "augmented 7th": [ 4, 4, 2, 2 ],
  "augmented major 7th": [ 4, 4, 3, 1 ],
}


export function getChord(pattern) {

console.log('GET CHORD', `"${pattern}"`, CHORDS[pattern])

  return CHORDS[pattern] || []
}

/*

Plan:

- Notes above octave: 9th, 11th, etc.
- Chord voicings..?

*/