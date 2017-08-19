
/*---------------------------------------------
 *
 * Scales
 *
 */

export const SCALES = {

  major: [ 2, 2, 1, 2, 2, 2, 1 ], // Same as Ionian
  minor: [ 2, 1, 2, 2, 1, 2, 2 ],

  "melodic minor": [ 2, 1, 2, 2, 2, 2, 1 ],
  "harmonic minor": [ 2, 1, 2, 2, 1, 3, 1 ],

  _: "",


  blues: [ 3, 2, 1, 1, 3, 2 ],
  "major pentatonic": [ 2, 2, 3, 2, 3 ],
  "minor pentatonic": [ 3, 2, 2, 3, 2 ],
  "gypsy blues": [ 2, 1, 3, 1, 1, 3, 1 ],
  "double harmonic": [ 1, 3, 1, 2, 1, 3, 1 ],

  __: "",

  chromatic: [ 1 ],
  wholetone: [ 2 ],
  diminished: [ 3 ],
  augmented: [ 4 ]
}

export function getScale(pattern) {

  console.log('GET SCALE', `"${pattern}"`, SCALES[pattern])

  return SCALES[pattern] || []
}
