
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

## How

WAV files are streamed through MP3 and base 64 conversion. The result is gathered into a JSON object, with note names for properties and sound data for values.
