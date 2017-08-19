
// Overview of Web MIDI API: https://www.w3.org/TR/webmidi/

export default {

  // --- MIDIAccess ---
  // https://www.w3.org/TR/webmidi/#idl-def-MIDIAccess

  access: null, // Attributes: inputs, outputs, onstatechange

  // --- MIDIInput ---
  // https://www.w3.org/TR/webmidi/#idl-def-MIDIInput

  inputs: [], // Attributes: onmidimessage

  // --- MIDIOutput ---
  // https://www.w3.org/TR/webmidi/#idl-def-MIDIOutput

  outputs: [], // Methods: clear, send
/*

  event: {
    port: 0, // MIDIInput number
    channel: 0,
    time: 0,
    message: 0,
    note: 0,
    velocity: 0
  }

*/
}
