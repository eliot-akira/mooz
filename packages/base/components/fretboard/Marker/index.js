import React from 'react'

export default function Marker({ color, label, isPlaying, events = {} }) {
  return (
    <div className={
        ["marker", isPlaying /*color!=='transparent'*/
          ? 'marker--highlight' : null].join(' ')
      } {...events}
    >
      {
        <div className={['marker--object', 'marker-base', `marker-${color || 'blue'}`].join(' ')}>
          <div className="marker--object-text-container">
            <div className="marker--object-text">
              {label}
            </div>
          </div>
        </div>
      }
    </div>
  )
}
