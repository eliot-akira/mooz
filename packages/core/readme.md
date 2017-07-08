

## Methods

### mooz

start
stop
pause

getTempo
setTempo

getPosition
setPosition

getTimeSignature
setTimeSignature

setLoop
clearLoop


load


## Properties




mooz.transport = Tone.Transport





## Player


fadeIn, fadeOut





## Example

```js

import mooz from 'mooz'

mooz.load({
  bass: {
    sounds: '/static/bass.json',
    scedule: '/static/bass.mid'
  },
  drums: {
    sounds: '/static/drums.json',
    scedule: '/static/drums.mid'
  },
  metronome: {
    sounds: '/static/metronome.json',
    // default schedule: every quarter note
    callback: ({ position }) => {
      console.log(position)
    },
  }
}).then(() => {

  mooz.start() // pause, stop

}).catch(err => {
  // Handle load error
})

```






---

# Future ideas

## Schedule

.mid or array of events

```js

const schedule = mooz.schedule('/static/rhythm.mid')

```

## Notation

Parse: .xml -> .json

```js
import moozXML from 'mooz.xml'

const score = moozXML.parse(JSONfile)

```

Draw

```js
import moozNotate from 'mooz.notate'

moozNotate(score) .. ?

