import React from 'react'
import initArray from '../../../util/initArray'

export default function StringSpacer({ frets, widths, dots = {}, className, fretMarkers = {} }) {

  return (
    <div className={["string string--spacer", className].join(' ')}>
      <div className="frets--container">
        <div className="frets">
          {
            initArray(frets + 1).map((i) => (
              <div key={i} className="fret" style={{ width: widths[i]+'%' }}>
                {
                  dots[i]? (
                    <div className="fret--dot" />
                  ) : null //fretMarkers[i] ? fretMarkers[i] : null
                }
              </div>
            ))
          }
        </div>
        <div className="string--container">
          <div className="string--background">
            <div className="string--top">

              <div className="frets">
                {
                  initArray(frets + 1).map((i) => (
                    <div key={i} className="fret fret--number" style={{ width: widths[i]+'%' }}>
                      { fretMarkers[i] ? fretMarkers[i] : null }
                    </div>
                  ))
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
