
# WavPack

Wavpack: Generate JSON from WAV and MP3 files

## Install

```bash
yarn global add wavpack
```

## Use

Find all `.wav` files in source folder, and build a single `.json` file with the name of the folder.

```bash
wavpack [source folder]
```

The convention is to name the `.wav` file as a combination of note name plus octave, such as `A1.wav`. If the file name matches this pattern, the note name will be normalized into *notes with flats only*.  For example, a file called `A#1_tap_ff.wav` will be converted into the note `Bb1`.

## How

WAV files are streamed through MP3 and base 64 conversion. The result is gathered into a JSON object, with note names for properties and sound data for values.
