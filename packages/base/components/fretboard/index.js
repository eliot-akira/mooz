import React, { Component } from 'react'
import String from './String'
import StringSpacer from './String/Spacer'
import { dotPositions, fretMarkers } from './constants'
import { getStrings, getFretWidths } from './utils/music'

const stringHighlightStyle = {
  borderColor: '#3d9970', //'#3f86ce', //'#000', //
  borderWidth: '2px'
}

export default class Fretboard extends Component {

  calculateFrets(props) {

    let {
      instrument = 'guitar',
      frets = 12
    } = props

    this.instrument = instrument
    this.strings = getStrings( instrument )

    if (!this.frets || this.frets!==frets) {
      this.frets = frets
      this.widths = getFretWidths( frets )
    }

    return {
      frets: this.frets,
      widths: this.widths,
      strings: this.strings
    }
  }

  render() {

    const {
      markers = [],
      fretboardPositions = [],
      nextFretboardPositions = [],
      highlightStrings = [],
      maxFrets = 12
    } = this.props

    const { frets, widths, strings } = this.calculateFrets({
      frets: maxFrets
    })

    return (
      <div className="fretboard-container">
      <div className="fretboard" ref={el => this.el = el}>
        <div className="fretboard--inner">

          <StringSpacer {...{ frets, widths /*, dots: dotPositions.spacer*/ }}  />

          { strings.map((note, i) =>
              <String key={i} {...{
                frets,
                widths,
                note,
                markers: markers.filter(m => m.string==(i+1)),
                positions: fretboardPositions.filter(f => f.string==(i+1)),
                nextPositions: nextFretboardPositions.filter(f => f.string==(i+1)),
                dots: dotPositions[i],
                stringStyle: highlightStrings.indexOf( (i+1)+'' ) >= 0
                  ? stringHighlightStyle
                  : {}
                //onNoteUp, onNoteDown
              }}/>
          )}

          <StringSpacer {...{ frets, widths, fretMarkers /*, dots: dotPositions.spacer*/ }} />
        </div>
      </div>
      </div>
    )
  }
}
