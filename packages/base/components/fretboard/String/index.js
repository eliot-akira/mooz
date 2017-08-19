import React from 'react'
import initArray from '../../../util/initArray'
import removeDuplicates from './removeDuplicates'
import { getNoteIndex } from '../utils/music'
import Marker from '../Marker'

export default function String(props) {

  const {

    frets, widths,

    markers = {}, positions = [], nextPositions = [],
    dots = {}, fretMarkers,

    onNoteUp, onNoteDown,
    note,
    stringStyle = {}
  } = props

  const start = getNoteIndex(note)
  const fretArray = initArray(frets + 1)

  return (
    <div className="string">
      <div className="frets--container">
        <div className="frets">
          {
            fretArray.map((x, i) => (
              <div key={i}
                className={["fret", i===0 ? "first-fret" : '' ].join(' ')}
                style={{ width: widths[i]+'%' }}
                  {...( i===0 ? {} : {
                    //onMouseEnter: () => onNoteDown(start+i),
                    //onMouseLeave: () => onNoteUp(start+i),
                  })}
              >
                {
                  dots[i]? (
                    <div className="fret--dot-between-strings">
                      <div className="fret--dot" />
                    </div>
                  ) : null
                }
              </div>
            ))
          }
        </div>
      </div>

      <div className="string--container">
        <div className="string--background">
          <div className="string--top" />
          <div className="string--line" style={stringStyle} />
          <div className="string--bottom" />
        </div>
      </div>

      <div className="markers--container">
        <div className="frets">
          { fretArray.map((x, i) => {

            const thesePositions = positions.filter(p => p.fret==i)
            const previewPositions = nextPositions.filter(p => p.fret==i)

            const thisMarker = markers.filter(m => m.fret==i)[0]
            return (
              <div
                key={i}
                className={[i===0 ? "first-fret" : ''].join(' ')}
                style={{ textAlign: 'center', width: widths[i]+'%' }}
              >
                <Marker
                  {...(
                    thisMarker
                    || {
                      color: 'transparent',
                      ...(!thesePositions.length ? (
                        !previewPositions.length ? {} : {
                          color: 'preview'+(previewPositions[0].firstNote ? '-first-note' : ''),
                          ...previewPositions[0],
                          label: removeDuplicates(previewPositions.map(p => p.finger)).join('/')
                        }
                      ) : {
                        color: 'shadow',
                        ...thesePositions[0],
                        label: removeDuplicates(thesePositions.map(p => p.finger)).join('/')
                      }),
                      isPlaying: false
                    }
                  )}
                  events={ i>0 ? {} : {
                  //onMouseEnter: () => onNoteDown(start+i),
                  //onMouseLeave: () => onNoteUp(start+i),
                  }} />
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
