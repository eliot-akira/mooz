import mooz from '../base'

export function setPickupMeasure(value = true, { setState }) {

  // Subtract a measure from beat count

  setState({ pickupMeasure: value ? 1 : 0 })

}
