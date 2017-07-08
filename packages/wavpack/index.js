const path = require('path')
const fs = require('fs')
const lame = require('lame')
const wav = require('./wav')
const base64 = require('base64-stream')
const glob = require('glob')
const mkdirp = require('mkdirp').sync

const cwd = process.cwd()
const srcPath = process.argv[2]
const destPath = process.argv[3] || '.'

if (!srcPath) usage()

const files = glob.sync(path.join(srcPath, '**/*.wav'), {
  ignore: ['**/.git/**', `**/node_modules/**`]
})

if (!files.length) {
  console.log(`No .wav files foound in "${srcPath}"`)
  process.exit(1)
}

const instruments = {
  // [name]: {
  //   [note]: [path to base64]
  // }
}

Promise.all(files.map(srcFile => {

  const fileRelative = path.relative(srcPath, srcFile)

  const parts = srcFile.split('/')
  const folderName = parts[parts.length - 2]
  const fileName = parts[parts.length - 1]
  const note = fileName.split('.').slice(0, -1)
  const srcFileFolder = parts.slice(0, -1).join('/')
  const tmpFile = path.join(srcFileFolder, `${note}.tmp`)

  if (!folderName) throw new Error(`No folder name for file: ${fileRelative}`)

  if (!instruments[folderName]) {
    instruments[folderName] = {}
    console.log(`Converting "${folderName}"..`) //${note} -> ${path.relative(srcPath, tmpFile)}
  }

  if (instruments[folderName][note]) {
    console.log(`Warning: Duplicate note name: ${note}`)
  }

  instruments[folderName][note] = tmpFile

  // wav -> mp3 -> base64

  return new Promise((resolve, reject) => {

    const input = fs.createReadStream(srcFile)
    const output = fs.createWriteStream(tmpFile)

    const reader = new wav.Reader()

    reader.on('format', (format) => {

      //console.log(`channels: ${format.channels}, sample rate: ${format.sampleRate}, byte rate: ${format.byteRate}, bit depth: ${format.bitDepth}`) //'WAV format: %j', format

      //format.bitRate = 128
      //format.outSampleRate = 22050
      //format.mode = lame.STEREO // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO

      const encoder = new lame.Encoder(format)
      const stream = reader.pipe(encoder)

      //stream.pipe(output) // MP3 output
      stream.pipe(new base64.Encode()).pipe(output)

      output.on('finish', () => {
        console.log(`${note}`)
        resolve()
      })
    })

    input.pipe(reader)
  })

})).then(() => {

  Object.keys(instruments).forEach(instrument => {

    // Concat base64 files for each instrument into JSON

    let data = '{'

    const notes = Object.keys(instruments[instrument])

    notes.forEach((note, noteIndex) => {

      const base64Path = instruments[instrument][note]
      const base64 = fs.readFileSync(base64Path, 'utf8')

      // NOTE: MIDI.js compatible option?
      //const prefix = `data:audio/mp3;base64,`
      const jsonLine = `"${note}":"${base64}"`

      data += jsonLine+(notes[noteIndex+1] ? ',' : '')//+'\n'

      // TODO: Individual notes?

      // Remove temp file
      fs.unlinkSync(base64Path)
    })

    data += '}'

    const instrumentFile = path.join(destPath, `${instrument}.json`)

    mkdirp(path.dirname(instrumentFile))

    fs.writeFileSync(instrumentFile, data, 'utf8')

    console.log('Built: '+path.relative(cwd, instrumentFile))
  })

})



function usage() {
  console.log('Usage: wavpack [source folder]')
  process.exit()
}
