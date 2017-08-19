import state from './state'

export default function updateState() {

  let { access } = state

  if (!access) return

  // Gather inputs/outpus

  //if (!access.inputs || access.inputs.size <= 0) return

  // MIDIInputMap
  let i = access.inputs.values()

  // MIDIOutputMap
  let o = access.outputs.values()

  state.inputs = []
  state.outputs = []

  for (let input=i.next(); input && !input.done; input=i.next()) {
    state.inputs.push(input.value)
  }
  for (let output=o.next(); output && !output.done; output=o.next()) {
    state.outputs.push(output.value)
  }
}
